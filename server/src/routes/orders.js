const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const DEFAULT_USER_ID = 1;

// Helper to generate order number
function generateOrderNumber() {
  const prefix = 'OD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
        !shippingAddress.pincode || !shippingAddress.addressLine1 ||
        !shippingAddress.city || !shippingAddress.state) {
      return res.status(400).json({ error: 'Complete shipping address is required' });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`,
        });
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.product.originalPrice) * item.quantity, 0
    );
    const totalSellingPrice = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.product.sellingPrice) * item.quantity, 0
    );
    const discount = subtotal - totalSellingPrice;
    const deliveryFee = totalSellingPrice > 500 ? 0 : 40;
    const total = totalSellingPrice + deliveryFee;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: DEFAULT_USER_ID,
          orderNumber: generateOrderNumber(),
          subtotal: Math.round(subtotal),
          discount: Math.round(discount),
          deliveryFee,
          total: Math.round(total),
          status: 'confirmed',
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.sellingPrice,
            })),
          },
          shippingAddress: {
            create: {
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              pincode: shippingAddress.pincode,
              addressLine1: shippingAddress.addressLine1,
              addressLine2: shippingAddress.addressLine2 || null,
              city: shippingAddress.city,
              state: shippingAddress.state,
              landmark: shippingAddress.landmark || null,
            },
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
        },
      });

      // Update stock for each product
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { userId: DEFAULT_USER_ID },
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders - Get user's order history
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { displayOrder: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get order details
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: DEFAULT_USER_ID,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { displayOrder: 'asc' }, take: 1 },
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
