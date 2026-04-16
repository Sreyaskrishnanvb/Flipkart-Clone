const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Default user ID (no auth)
const DEFAULT_USER_ID = 1;

// GET /api/cart - Get user's cart items
router.get('/', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: {
        product: {
          include: {
            images: { orderBy: { displayOrder: 'asc' }, take: 1 },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.originalPrice) * item.quantity;
    }, 0);

    const totalSellingPrice = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.sellingPrice) * item.quantity;
    }, 0);

    const discount = subtotal - totalSellingPrice;
    const deliveryFee = totalSellingPrice > 500 ? 0 : 40;
    const total = totalSellingPrice + deliveryFee;

    res.json({
      items: cartItems,
      summary: {
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: Math.round(subtotal),
        discount: Math.round(discount),
        deliveryFee,
        total: Math.round(total),
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Upsert cart item (create or update)
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: DEFAULT_USER_ID,
          productId: parseInt(productId),
        },
      },
      update: {
        quantity: { increment: parseInt(quantity) },
      },
      create: {
        userId: DEFAULT_USER_ID,
        productId: parseInt(productId),
        quantity: parseInt(quantity),
      },
      include: {
        product: {
          include: {
            images: { orderBy: { displayOrder: 'asc' }, take: 1 },
          },
        },
      },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: parseInt(req.params.id), userId: DEFAULT_USER_ID },
      include: { product: true },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: parseInt(req.params.id) },
      data: { quantity: parseInt(quantity) },
      include: {
        product: {
          include: {
            images: { orderBy: { displayOrder: 'asc' }, take: 1 },
          },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: parseInt(req.params.id), userId: DEFAULT_USER_ID },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

module.exports = router;
