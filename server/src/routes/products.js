const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products - List products with search, category filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, minRating, page = 1, limit = 20, sort } = req.query;

    const where = {};

    // Search by name or brand
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    // Filter by category slug
    if (category) {
      where.category = { slug: category };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.sellingPrice = {};
      if (minPrice) where.sellingPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.sellingPrice.lte = parseFloat(maxPrice);
    }

    // Filter by minimum rating
    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    // Sorting options
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_low') orderBy = { sellingPrice: 'asc' };
    else if (sort === 'price_high') orderBy = { sellingPrice: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'popular') orderBy = { ratingCount: 'desc' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { displayOrder: 'asc' }, take: 1 },
        },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Product detail with images, specs
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        specifications: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
