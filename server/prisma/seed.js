const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.shippingAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create default user
  const user = await prisma.user.create({
    data: {
      id: 1,
      name: 'Sreya',
      email: 'sreya@example.com',
      phone: '9876543210',
    },
  });
  console.log('✅ Default user created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Electronics', slug: 'electronics', imageUrl: 'https://cdn-icons-png.flaticon.com/128/3659/3659899.png' } }),
    prisma.category.create({ data: { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://cdn-icons-png.flaticon.com/128/0/191.png' } }),
    prisma.category.create({ data: { name: 'Fashion', slug: 'fashion', imageUrl: 'https://cdn-icons-png.flaticon.com/128/863/863684.png' } }),
    prisma.category.create({ data: { name: 'Home & Furniture', slug: 'home-furniture', imageUrl: 'https://cdn-icons-png.flaticon.com/128/1046/1046869.png' } }),
    prisma.category.create({ data: { name: 'Appliances', slug: 'appliances', imageUrl: 'https://cdn-icons-png.flaticon.com/128/2933/2933245.png' } }),
    prisma.category.create({ data: { name: 'Beauty & Personal Care', slug: 'beauty', imageUrl: 'https://cdn-icons-png.flaticon.com/128/1940/1940922.png' } }),
    prisma.category.create({ data: { name: 'Sports & Fitness', slug: 'sports', imageUrl: 'https://cdn-icons-png.flaticon.com/128/857/857455.png' } }),
    prisma.category.create({ data: { name: 'Books', slug: 'books', imageUrl: 'https://cdn-icons-png.flaticon.com/128/3389/3389081.png' } }),
  ]);
  console.log('✅ 8 categories created');

  const [electronics, mobiles, fashion, home, appliances, beauty, sports, books] = categories;

  // Helper for creating products
  const createProduct = async (data) => {
    const { images, specifications, ...productData } = data;
    const product = await prisma.product.create({ data: productData });

    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url, index) => ({
          productId: product.id,
          imageUrl: url,
          displayOrder: index,
        })),
      });
    }

    if (specifications && specifications.length > 0) {
      await prisma.productSpecification.createMany({
        data: specifications.map((spec) => ({
          productId: product.id,
          specKey: spec.key,
          specValue: spec.value,
        })),
      });
    }

    return product;
  };

  // ========================
  // ELECTRONICS (6 products)
  // ========================
  await createProduct({
    name: 'boAt Rockerz 450 Bluetooth Wireless Over Ear Headphone with Mic',
    brand: 'boAt',
    description: 'Experience immersive audio with boAt Rockerz 450 headphones featuring 40mm dynamic drivers, padded ear cushions, and up to 15 hours of playback time. The lightweight design ensures comfortable wear during long listening sessions.',
    originalPrice: 3990,
    sellingPrice: 1299,
    discountPercent: 67,
    stock: 150,
    rating: 4.1,
    ratingCount: 87432,
    categoryId: electronics.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'boAt' },
      { key: 'Model', value: 'Rockerz 450' },
      { key: 'Type', value: 'Over the Ear' },
      { key: 'Connectivity', value: 'Bluetooth 4.2' },
      { key: 'Battery Life', value: '15 Hours' },
      { key: 'Driver Size', value: '40mm' },
      { key: 'Weight', value: '224g' },
    ],
  });

  await createProduct({
    name: 'JBL Tune 230NC TWS True Wireless In Ear Earbuds',
    brand: 'JBL',
    description: 'JBL Tune 230NC TWS earbuds with Active Noise Cancellation, JBL Pure Bass Sound, 4-mic technology for crystal clear calls, and up to 40 hours of total playtime with the charging case.',
    originalPrice: 4999,
    sellingPrice: 2999,
    discountPercent: 40,
    stock: 85,
    rating: 4.3,
    ratingCount: 45231,
    categoryId: electronics.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'JBL' },
      { key: 'Model', value: 'Tune 230NC' },
      { key: 'Type', value: 'In the Ear' },
      { key: 'Noise Cancelling', value: 'Yes - ANC' },
      { key: 'Battery Life', value: '40 Hours (with case)' },
      { key: 'Water Resistant', value: 'IPX4' },
    ],
  });

  await createProduct({
    name: 'Sony WH-1000XM5 Wireless Industry Leading Active Noise Cancelling Headphones',
    brand: 'Sony',
    description: 'Premium noise cancelling headphones with Auto NC Optimizer, Speak-to-Chat technology, multipoint connection, 30-hour battery life, and exceptional Hi-Res audio quality.',
    originalPrice: 34990,
    sellingPrice: 24990,
    discountPercent: 28,
    stock: 30,
    rating: 4.5,
    ratingCount: 12098,
    categoryId: electronics.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Sony' },
      { key: 'Model', value: 'WH-1000XM5' },
      { key: 'Type', value: 'Over the Ear' },
      { key: 'Noise Cancelling', value: 'Industry Leading ANC' },
      { key: 'Battery Life', value: '30 Hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.2' },
      { key: 'Weight', value: '250g' },
    ],
  });

  await createProduct({
    name: 'Samsung 980 PRO 1TB PCIe NVMe Gen 4 Internal Solid State Drive',
    brand: 'Samsung',
    description: 'Unleash the power of Samsung 980 PRO NVMe M.2 SSD with read speeds up to 7,000 MB/s and write speeds up to 5,000 MB/s powered by a custom Elpis controller.',
    originalPrice: 14999,
    sellingPrice: 7499,
    discountPercent: 50,
    stock: 45,
    rating: 4.6,
    ratingCount: 8734,
    categoryId: electronics.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Samsung' },
      { key: 'Capacity', value: '1 TB' },
      { key: 'Interface', value: 'PCIe Gen 4 NVMe' },
      { key: 'Read Speed', value: '7,000 MB/s' },
      { key: 'Write Speed', value: '5,000 MB/s' },
      { key: 'Form Factor', value: 'M.2 2280' },
    ],
  });

  await createProduct({
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    description: 'Advanced wireless mouse with 8K DPI optical sensor, quiet clicks, MagSpeed electromagnetic scrolling, USB-C charging, and multi-device connectivity via Bluetooth or USB receiver.',
    originalPrice: 10995,
    sellingPrice: 8495,
    discountPercent: 22,
    stock: 60,
    rating: 4.4,
    ratingCount: 5621,
    categoryId: electronics.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Logitech' },
      { key: 'Model', value: 'MX Master 3S' },
      { key: 'Connectivity', value: 'Bluetooth + USB' },
      { key: 'DPI', value: '8000' },
      { key: 'Battery', value: 'Rechargeable Li-Po' },
      { key: 'Weight', value: '141g' },
    ],
  });

  await createProduct({
    name: 'HP 27" Full HD IPS Monitor with AMD FreeSync',
    brand: 'HP',
    description: 'HP 27-inch Full HD IPS display with ultra-thin micro-edge bezels, AMD FreeSync technology, 300 nits brightness, and HDMI/VGA connectivity for a stunning visual experience.',
    originalPrice: 22999,
    sellingPrice: 14999,
    discountPercent: 34,
    stock: 25,
    rating: 4.3,
    ratingCount: 3892,
    categoryId: electronics.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'HP' },
      { key: 'Screen Size', value: '27 inch' },
      { key: 'Resolution', value: '1920 x 1080 (Full HD)' },
      { key: 'Panel Type', value: 'IPS' },
      { key: 'Refresh Rate', value: '75 Hz' },
      { key: 'Connectivity', value: 'HDMI, VGA' },
    ],
  });

  // ========================
  // MOBILES (6 products)
  // ========================
  await createProduct({
    name: 'Apple iPhone 15 (Black, 128 GB)',
    brand: 'Apple',
    description: 'iPhone 15 features Dynamic Island, 48MP Main camera with 2x Telephoto, A16 Bionic chip, USB-C connector, and durable design with Ceramic Shield front and aluminum body.',
    originalPrice: 79900,
    sellingPrice: 69900,
    discountPercent: 12,
    stock: 40,
    rating: 4.6,
    ratingCount: 23456,
    categoryId: mobiles.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Apple' },
      { key: 'Model', value: 'iPhone 15' },
      { key: 'Storage', value: '128 GB' },
      { key: 'RAM', value: '6 GB' },
      { key: 'Display', value: '6.1 inch Super Retina XDR' },
      { key: 'Processor', value: 'A16 Bionic' },
      { key: 'Camera', value: '48MP + 12MP' },
      { key: 'Battery', value: '3349 mAh' },
      { key: 'OS', value: 'iOS 17' },
    ],
  });

  await createProduct({
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    brand: 'Samsung',
    description: 'Galaxy S24 Ultra with Galaxy AI, 200MP camera, Snapdragon 8 Gen 3 processor, S Pen built-in, 6.8" QHD+ Dynamic AMOLED display, and titanium frame for ultimate durability.',
    originalPrice: 134999,
    sellingPrice: 119999,
    discountPercent: 11,
    stock: 20,
    rating: 4.5,
    ratingCount: 15678,
    categoryId: mobiles.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Samsung' },
      { key: 'Model', value: 'Galaxy S24 Ultra' },
      { key: 'Storage', value: '256 GB' },
      { key: 'RAM', value: '12 GB' },
      { key: 'Display', value: '6.8 inch QHD+ Dynamic AMOLED' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'Camera', value: '200MP + 50MP + 12MP + 10MP' },
      { key: 'Battery', value: '5000 mAh' },
    ],
  });

  await createProduct({
    name: 'OnePlus 12 (Flowy Emerald, 256 GB)',
    brand: 'OnePlus',
    description: 'OnePlus 12 powered by Snapdragon 8 Gen 3, Hasselblad 4th Gen camera system with 50MP main sensor, 6.82" 2K ProXDR display, 100W SUPERVOOC charging, and 5400mAh battery.',
    originalPrice: 69999,
    sellingPrice: 64999,
    discountPercent: 7,
    stock: 35,
    rating: 4.4,
    ratingCount: 18234,
    categoryId: mobiles.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'OnePlus' },
      { key: 'Model', value: 'OnePlus 12' },
      { key: 'Storage', value: '256 GB' },
      { key: 'RAM', value: '12 GB' },
      { key: 'Display', value: '6.82 inch 2K ProXDR AMOLED' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'Camera', value: '50MP + 48MP + 64MP' },
      { key: 'Battery', value: '5400 mAh' },
    ],
  });

  await createProduct({
    name: 'Redmi Note 13 Pro+ 5G (Fusion Purple, 256 GB)',
    brand: 'Xiaomi',
    description: 'Redmi Note 13 Pro+ features a 200MP OIS camera, MediaTek Dimensity 7200-Ultra processor, 6.67" 1.5K AMOLED display with 120Hz refresh rate, and 120W HyperCharge.',
    originalPrice: 33999,
    sellingPrice: 28999,
    discountPercent: 14,
    stock: 80,
    rating: 4.2,
    ratingCount: 34567,
    categoryId: mobiles.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Xiaomi' },
      { key: 'Model', value: 'Redmi Note 13 Pro+' },
      { key: 'Storage', value: '256 GB' },
      { key: 'RAM', value: '12 GB' },
      { key: 'Display', value: '6.67 inch 1.5K AMOLED' },
      { key: 'Processor', value: 'MediaTek Dimensity 7200-Ultra' },
      { key: 'Camera', value: '200MP + 8MP + 2MP' },
      { key: 'Battery', value: '5000 mAh' },
    ],
  });

  await createProduct({
    name: 'realme narzo 70x 5G (Ice Blue, 128 GB)',
    brand: 'realme',
    description: 'Budget-friendly 5G smartphone with MediaTek Dimensity 6100+, 50MP AI camera, 6.72" 120Hz display, 5000mAh battery, and 33W Supervooc charging.',
    originalPrice: 13999,
    sellingPrice: 11499,
    discountPercent: 17,
    stock: 120,
    rating: 4.0,
    ratingCount: 45678,
    categoryId: mobiles.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'realme' },
      { key: 'Model', value: 'narzo 70x 5G' },
      { key: 'Storage', value: '128 GB' },
      { key: 'RAM', value: '6 GB' },
      { key: 'Display', value: '6.72 inch HD+ 120Hz' },
      { key: 'Processor', value: 'MediaTek Dimensity 6100+' },
      { key: 'Battery', value: '5000 mAh' },
    ],
  });

  await createProduct({
    name: 'POCO M6 5G (Galactic Black, 128 GB)',
    brand: 'POCO',
    description: 'POCO M6 5G with MediaTek Dimensity 6100+ chipset, 50MP dual camera, 6.74" HD+ 90Hz display, 5000mAh battery, and 18W fast charging support.',
    originalPrice: 10999,
    sellingPrice: 8499,
    discountPercent: 22,
    stock: 200,
    rating: 4.1,
    ratingCount: 67890,
    categoryId: mobiles.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1609252925148-b0f1b515e111?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'POCO' },
      { key: 'Model', value: 'M6 5G' },
      { key: 'Storage', value: '128 GB' },
      { key: 'RAM', value: '6 GB' },
      { key: 'Display', value: '6.74 inch HD+ 90Hz' },
      { key: 'Processor', value: 'MediaTek Dimensity 6100+' },
      { key: 'Battery', value: '5000 mAh' },
    ],
  });

  // ========================
  // FASHION (6 products)
  // ========================
  await createProduct({
    name: 'Roadster Men Slim Fit Mid-Rise Clean Look Stretchable Jeans',
    brand: 'Roadster',
    description: 'Classic slim fit jeans with mid-rise waist, clean look finish, stretchable cotton blend fabric for comfort, 5-pocket design, and button fly closure.',
    originalPrice: 1999,
    sellingPrice: 699,
    discountPercent: 65,
    stock: 200,
    rating: 4.0,
    ratingCount: 56789,
    categoryId: fashion.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Roadster' },
      { key: 'Fit', value: 'Slim Fit' },
      { key: 'Rise', value: 'Mid Rise' },
      { key: 'Material', value: 'Cotton Blend' },
      { key: 'Stretch', value: 'Stretchable' },
      { key: 'Closure', value: 'Button' },
    ],
  });

  await createProduct({
    name: 'Nike Men Air Max SC Running Shoes',
    brand: 'Nike',
    description: 'Nike Air Max SC sneakers with visible Max Air unit in the heel, lightweight foam midsole, padded collar, and durable rubber outsole. Classic Nike style for everyday comfort.',
    originalPrice: 7495,
    sellingPrice: 4497,
    discountPercent: 40,
    stock: 50,
    rating: 4.3,
    ratingCount: 12345,
    categoryId: fashion.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Nike' },
      { key: 'Model', value: 'Air Max SC' },
      { key: 'Type', value: 'Running Shoes' },
      { key: 'Upper Material', value: 'Mesh & Synthetic' },
      { key: 'Sole Material', value: 'Rubber' },
      { key: 'Closure', value: 'Lace-Up' },
    ],
  });

  await createProduct({
    name: 'Allen Solly Men Slim Fit Checkered Spread Collar Formal Shirt',
    brand: 'Allen Solly',
    description: 'Premium formal shirt with slim fit, checkered pattern, spread collar, full sleeves, and high-quality cotton fabric blend perfect for office and formal occasions.',
    originalPrice: 2199,
    sellingPrice: 879,
    discountPercent: 60,
    stock: 100,
    rating: 4.1,
    ratingCount: 23456,
    categoryId: fashion.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Allen Solly' },
      { key: 'Fit', value: 'Slim Fit' },
      { key: 'Pattern', value: 'Checkered' },
      { key: 'Collar', value: 'Spread Collar' },
      { key: 'Sleeve', value: 'Full Sleeve' },
      { key: 'Material', value: 'Cotton Blend' },
    ],
  });

  await createProduct({
    name: 'Levi\'s Women Boyfriend Fit High-Rise Light Fade Jeans',
    brand: 'Levi\'s',
    description: 'Relaxed boyfriend fit jeans with high waist, light fade wash, premium denim fabric, classic 5-pocket styling, and Levi\'s signature quality craftsmanship.',
    originalPrice: 3999,
    sellingPrice: 1599,
    discountPercent: 60,
    stock: 75,
    rating: 4.2,
    ratingCount: 18765,
    categoryId: fashion.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Levi\'s' },
      { key: 'Fit', value: 'Boyfriend Fit' },
      { key: 'Rise', value: 'High Rise' },
      { key: 'Wash', value: 'Light Fade' },
      { key: 'Material', value: 'Cotton Denim' },
    ],
  });

  await createProduct({
    name: 'Puma Men RS-X Reinvention Sneakers',
    brand: 'Puma',
    description: 'Bold retro-inspired Puma RS-X sneakers with running system cushioning technology, mesh-leather upper, chunky sole unit, and eye-catching color blocking design.',
    originalPrice: 8999,
    sellingPrice: 5399,
    discountPercent: 40,
    stock: 40,
    rating: 4.4,
    ratingCount: 9876,
    categoryId: fashion.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Puma' },
      { key: 'Model', value: 'RS-X Reinvention' },
      { key: 'Type', value: 'Sneakers' },
      { key: 'Upper Material', value: 'Mesh & Leather' },
      { key: 'Sole Material', value: 'Rubber' },
      { key: 'Closure', value: 'Lace-Up' },
    ],
  });

  await createProduct({
    name: 'HRX by Hrithik Roshan Women Rapid Dry Antimicrobial Running T-Shirt',
    brand: 'HRX',
    description: 'Performance running t-shirt with rapid dry technology, antimicrobial treatment, lightweight breathable fabric, round neck, and athletic fit designed for active lifestyles.',
    originalPrice: 1299,
    sellingPrice: 449,
    discountPercent: 65,
    stock: 150,
    rating: 4.0,
    ratingCount: 34567,
    categoryId: fashion.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'HRX' },
      { key: 'Fit', value: 'Athletic Fit' },
      { key: 'Sleeve', value: 'Short Sleeve' },
      { key: 'Neck', value: 'Round Neck' },
      { key: 'Material', value: 'Polyester' },
      { key: 'Technology', value: 'Rapid Dry, Antimicrobial' },
    ],
  });

  // ========================
  // HOME & FURNITURE (5 products)
  // ========================
  await createProduct({
    name: 'Wakefit Orthopedic Memory Foam Mattress - Queen Size',
    brand: 'Wakefit',
    description: 'Premium queen-size memory foam mattress with orthopedic support, pressure-relieving memory foam layer, high-density base foam, breathable knitted cover, and 10-year warranty.',
    originalPrice: 18999,
    sellingPrice: 9999,
    discountPercent: 47,
    stock: 30,
    rating: 4.3,
    ratingCount: 67890,
    categoryId: home.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Wakefit' },
      { key: 'Size', value: 'Queen (78x60 inches)' },
      { key: 'Thickness', value: '6 inches' },
      { key: 'Material', value: 'Memory Foam' },
      { key: 'Warranty', value: '10 Years' },
      { key: 'Type', value: 'Orthopedic' },
    ],
  });

  await createProduct({
    name: 'IKEA KALLAX Shelf Unit - 4x4 White',
    brand: 'IKEA',
    description: 'Versatile 4x4 KALLAX shelf unit in white finish, perfect for books, décor, and storage boxes. Can be used as room divider, wall-mounted or freestanding.',
    originalPrice: 12990,
    sellingPrice: 10990,
    discountPercent: 15,
    stock: 15,
    rating: 4.5,
    ratingCount: 4567,
    categoryId: home.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'IKEA' },
      { key: 'Model', value: 'KALLAX' },
      { key: 'Configuration', value: '4x4 (16 cubbies)' },
      { key: 'Color', value: 'White' },
      { key: 'Material', value: 'Particleboard, Fiberboard' },
      { key: 'Dimensions', value: '147 x 147 x 39 cm' },
    ],
  });

  await createProduct({
    name: 'Nilkamal Plastic Foldable Study Table',
    brand: 'Nilkamal',
    description: 'Sturdy plastic foldable study table ideal for home and office. Lightweight, easy to fold and store, weather-resistant material with a smooth working surface.',
    originalPrice: 4999,
    sellingPrice: 2299,
    discountPercent: 54,
    stock: 50,
    rating: 3.9,
    ratingCount: 12345,
    categoryId: home.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Nilkamal' },
      { key: 'Type', value: 'Study Table' },
      { key: 'Material', value: 'Plastic' },
      { key: 'Foldable', value: 'Yes' },
      { key: 'Color', value: 'Brown' },
    ],
  });

  await createProduct({
    name: 'Amazon Basics Cotton Bath Towel Set - Pack of 4',
    brand: 'Amazon Basics',
    description: 'Premium cotton bath towel set with 4 towels. Soft, absorbent 100% cotton, ring-spun for superior softness, reinforced edges for durability, machine washable.',
    originalPrice: 2499,
    sellingPrice: 1199,
    discountPercent: 52,
    stock: 100,
    rating: 4.1,
    ratingCount: 23456,
    categoryId: home.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Amazon Basics' },
      { key: 'Material', value: '100% Cotton' },
      { key: 'Pack Of', value: '4' },
      { key: 'Weight', value: '500 GSM' },
      { key: 'Care', value: 'Machine Washable' },
    ],
  });

  await createProduct({
    name: 'Philips Hue White Ambiance Smart LED Bulb - Pack of 2',
    brand: 'Philips',
    description: 'Smart LED bulbs with warm-to-cool white light range (2200K-6500K), dimmable via app, voice control compatible with Alexa & Google, 806 lumens, 9W energy efficient.',
    originalPrice: 3499,
    sellingPrice: 2799,
    discountPercent: 20,
    stock: 70,
    rating: 4.2,
    ratingCount: 8765,
    categoryId: home.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550985543-49bee3167284?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Philips' },
      { key: 'Model', value: 'Hue White Ambiance' },
      { key: 'Wattage', value: '9W' },
      { key: 'Lumens', value: '806' },
      { key: 'Color Temperature', value: '2200K-6500K' },
      { key: 'Compatibility', value: 'Alexa, Google Assistant' },
    ],
  });

  // ========================
  // APPLIANCES (5 products)
  // ========================
  await createProduct({
    name: 'Samsung 253L Frost Free Double Door Refrigerator',
    brand: 'Samsung',
    description: 'Samsung 253L double door refrigerator with digital inverter compressor, convertible 5-in-1 modes, all-around cooling, power cool feature, and energy efficient operation.',
    originalPrice: 32990,
    sellingPrice: 24990,
    discountPercent: 24,
    stock: 15,
    rating: 4.3,
    ratingCount: 34567,
    categoryId: appliances.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Samsung' },
      { key: 'Capacity', value: '253 Litres' },
      { key: 'Type', value: 'Double Door' },
      { key: 'Star Rating', value: '3 Star' },
      { key: 'Compressor', value: 'Digital Inverter' },
      { key: 'Warranty', value: '1 Year + 20 Year Compressor' },
    ],
  });

  await createProduct({
    name: 'LG 7 kg 5 Star Inverter Fully-Automatic Front Load Washing Machine',
    brand: 'LG',
    description: 'LG 7kg front load washing machine with 6 Motion Direct Drive technology, steam wash, AI DD intelligent fabric care, 1200 RPM spin speed, and 5-star energy rating.',
    originalPrice: 36990,
    sellingPrice: 28990,
    discountPercent: 21,
    stock: 20,
    rating: 4.4,
    ratingCount: 23456,
    categoryId: appliances.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'LG' },
      { key: 'Capacity', value: '7 kg' },
      { key: 'Type', value: 'Front Load' },
      { key: 'Star Rating', value: '5 Star' },
      { key: 'RPM', value: '1200' },
      { key: 'Technology', value: 'AI DD, 6 Motion Direct Drive' },
    ],
  });

  await createProduct({
    name: 'Bajaj Majesty DX-11 1000W Dry Iron',
    brand: 'Bajaj',
    description: 'Lightweight and efficient dry iron with 1000W power, non-stick coated soleplate, adjustable temperature control, indicator light, and 360° swivel cord.',
    originalPrice: 899,
    sellingPrice: 549,
    discountPercent: 38,
    stock: 200,
    rating: 4.0,
    ratingCount: 45678,
    categoryId: appliances.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Bajaj' },
      { key: 'Model', value: 'Majesty DX-11' },
      { key: 'Type', value: 'Dry Iron' },
      { key: 'Wattage', value: '1000W' },
      { key: 'Soleplate', value: 'Non-Stick Coated' },
      { key: 'Cord', value: '360° Swivel' },
    ],
  });

  await createProduct({
    name: 'Prestige IRIS 750W Mixer Grinder - 3 Jars',
    brand: 'Prestige',
    description: 'Powerful 750W mixer grinder with 3 stainless steel jars, super efficient motor, ergonomic handles, anti-skid feet, and overload protection for long-lasting performance.',
    originalPrice: 4495,
    sellingPrice: 2699,
    discountPercent: 39,
    stock: 90,
    rating: 4.1,
    ratingCount: 56789,
    categoryId: appliances.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585237017125-24bce0da4a7c?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Prestige' },
      { key: 'Model', value: 'IRIS' },
      { key: 'Wattage', value: '750W' },
      { key: 'Jars', value: '3 Stainless Steel' },
      { key: 'RPM', value: '20000' },
      { key: 'Warranty', value: '2 Years' },
    ],
  });

  await createProduct({
    name: 'Havells Instanio Prime 3L Instant Water Heater',
    brand: 'Havells',
    description: 'Compact 3-litre instant water heater with color-changing LED indicators, heavy-duty heating element, whirlflow technology, and ISI certified with multiple safety features.',
    originalPrice: 5690,
    sellingPrice: 3990,
    discountPercent: 29,
    stock: 55,
    rating: 4.2,
    ratingCount: 12345,
    categoryId: appliances.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Havells' },
      { key: 'Model', value: 'Instanio Prime' },
      { key: 'Capacity', value: '3 Litres' },
      { key: 'Type', value: 'Instant' },
      { key: 'Element', value: 'Heavy Duty Incoloy' },
      { key: 'Warranty', value: '5 Years on Inner Tank' },
    ],
  });

  // ========================
  // BEAUTY (5 products)
  // ========================
  await createProduct({
    name: 'Maybelline New York Fit Me Matte+Poreless Liquid Foundation',
    brand: 'Maybelline',
    description: 'Lightweight foundation with micro-powders that blur pores and absorb oil for a natural matte finish. Available in 18 shades to match Indian skin tones perfectly.',
    originalPrice: 599,
    sellingPrice: 399,
    discountPercent: 33,
    stock: 300,
    rating: 4.1,
    ratingCount: 89012,
    categoryId: beauty.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Maybelline' },
      { key: 'Product Type', value: 'Liquid Foundation' },
      { key: 'Finish', value: 'Matte' },
      { key: 'Volume', value: '30ml' },
      { key: 'Skin Type', value: 'Normal to Oily' },
    ],
  });

  await createProduct({
    name: 'The Man Company Charcoal Face Wash for Men',
    brand: 'The Man Company',
    description: 'Activated charcoal face wash with deep cleansing properties. Removes dirt, oil, and pollutants while maintaining natural moisture balance. Enriched with Vitamin C and green tea.',
    originalPrice: 349,
    sellingPrice: 249,
    discountPercent: 28,
    stock: 180,
    rating: 4.0,
    ratingCount: 34567,
    categoryId: beauty.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'The Man Company' },
      { key: 'Product Type', value: 'Face Wash' },
      { key: 'For', value: 'Men' },
      { key: 'Key Ingredient', value: 'Activated Charcoal' },
      { key: 'Volume', value: '100ml' },
    ],
  });

  await createProduct({
    name: 'Biotique Bio Green Apple Fresh Daily Purifying Shampoo',
    brand: 'Biotique',
    description: 'Nature-inspired purifying shampoo with fresh green apple and soy protein extract. Gently cleanses scalp, strengthens hair roots, and adds volume and shine.',
    originalPrice: 350,
    sellingPrice: 210,
    discountPercent: 40,
    stock: 250,
    rating: 4.0,
    ratingCount: 67890,
    categoryId: beauty.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Biotique' },
      { key: 'Product Type', value: 'Shampoo' },
      { key: 'Hair Type', value: 'All Hair Types' },
      { key: 'Key Ingredient', value: 'Green Apple, Soy Protein' },
      { key: 'Volume', value: '340ml' },
    ],
  });

  await createProduct({
    name: 'Nivea Soft Moisturizing Cream - 200ml',
    brand: 'Nivea',
    description: 'Multi-purpose moisturizing cream enriched with Vitamin E and Jojoba Oil. Provides instant 48-hour moisture. Non-greasy, fast-absorbing formula for face, hands, and body.',
    originalPrice: 350,
    sellingPrice: 263,
    discountPercent: 24,
    stock: 400,
    rating: 4.3,
    ratingCount: 78901,
    categoryId: beauty.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e68a0?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Nivea' },
      { key: 'Product Type', value: 'Moisturizing Cream' },
      { key: 'Volume', value: '200ml' },
      { key: 'Key Ingredient', value: 'Vitamin E, Jojoba Oil' },
      { key: 'Skin Type', value: 'All Skin Types' },
    ],
  });

  await createProduct({
    name: 'SUGAR Matte As Hell Crayon Lipstick - Scarlett O\'Hara',
    brand: 'SUGAR Cosmetics',
    description: 'Highly pigmented matte crayon lipstick with one-swipe color payoff. Long-lasting formula that stays comfortable all day. Built-in sharpener for precision application.',
    originalPrice: 799,
    sellingPrice: 599,
    discountPercent: 25,
    stock: 120,
    rating: 4.2,
    ratingCount: 23456,
    categoryId: beauty.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'SUGAR Cosmetics' },
      { key: 'Product Type', value: 'Crayon Lipstick' },
      { key: 'Finish', value: 'Matte' },
      { key: 'Shade', value: 'Scarlett O\'Hara (Red)' },
      { key: 'Weight', value: '2.8g' },
    ],
  });

  // ========================
  // SPORTS (5 products)
  // ========================
  await createProduct({
    name: 'Yonex NANORAY Light 18i Badminton Racquet',
    brand: 'Yonex',
    description: 'Lightweight badminton racquet with isometric head shape for larger sweet spot. Graphite shaft with nano mesh construction for enhanced repulsion power and quick swing speed.',
    originalPrice: 2490,
    sellingPrice: 1690,
    discountPercent: 32,
    stock: 60,
    rating: 4.2,
    ratingCount: 18765,
    categoryId: sports.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Yonex' },
      { key: 'Model', value: 'NANORAY Light 18i' },
      { key: 'Weight', value: '77g' },
      { key: 'Material', value: 'Graphite' },
      { key: 'Head Shape', value: 'Isometric' },
      { key: 'String Tension', value: '20-28 lbs' },
    ],
  });

  await createProduct({
    name: 'Boldfit Yoga Mat for Men and Women NBR - 6mm Extra Thick',
    brand: 'Boldfit',
    description: 'Extra thick 6mm NBR yoga mat with anti-slip texture, high-density cushioning for joint protection, moisture-resistant surface, and carrying strap included.',
    originalPrice: 1299,
    sellingPrice: 399,
    discountPercent: 69,
    stock: 150,
    rating: 4.0,
    ratingCount: 45678,
    categoryId: sports.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Boldfit' },
      { key: 'Material', value: 'NBR (Nitrile Butadiene Rubber)' },
      { key: 'Thickness', value: '6mm' },
      { key: 'Dimensions', value: '183 x 61 cm' },
      { key: 'Features', value: 'Anti-Slip, Moisture Resistant' },
    ],
  });

  await createProduct({
    name: 'Nivia Storm Football - Size 5',
    brand: 'Nivia',
    description: 'Match-quality football with hand-stitched PU leather construction, butyl bladder for optimal air retention, 32-panel design for consistent flight, and FIFA basic certification.',
    originalPrice: 999,
    sellingPrice: 599,
    discountPercent: 40,
    stock: 80,
    rating: 4.1,
    ratingCount: 23456,
    categoryId: sports.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1614632537423-1e6078b0e1cc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'Nivia' },
      { key: 'Model', value: 'Storm' },
      { key: 'Size', value: '5 (Standard)' },
      { key: 'Material', value: 'PU Leather' },
      { key: 'Panels', value: '32' },
      { key: 'Bladder', value: 'Butyl' },
    ],
  });

  await createProduct({
    name: 'JELEX Iron Dumbbell Set 20 kg with Carry Case',
    brand: 'JELEX',
    description: 'Adjustable 20kg iron dumbbell set with chrome-plated bars, star lock collars, interchangeable weight plates, and portable carry case for home and gym workouts.',
    originalPrice: 3999,
    sellingPrice: 1999,
    discountPercent: 50,
    stock: 40,
    rating: 4.0,
    ratingCount: 12345,
    categoryId: sports.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'JELEX' },
      { key: 'Total Weight', value: '20 kg' },
      { key: 'Material', value: 'Cast Iron' },
      { key: 'Bar Type', value: 'Chrome Plated' },
      { key: 'Includes', value: 'Carry Case, Star Lock Collars' },
    ],
  });

  await createProduct({
    name: 'MR.BEAST Ultra Protein Shaker Bottle 700ml',
    brand: 'MR.BEAST',
    description: 'BPA-free protein shaker with stainless steel mixing ball, leak-proof flip cap, measurement markings, wide mouth for easy filling and cleaning, ergonomic grip design.',
    originalPrice: 599,
    sellingPrice: 299,
    discountPercent: 50,
    stock: 200,
    rating: 3.9,
    ratingCount: 34567,
    categoryId: sports.id,
    isAssured: false,
    images: [
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Brand', value: 'MR.BEAST' },
      { key: 'Capacity', value: '700ml' },
      { key: 'Material', value: 'BPA-Free Plastic' },
      { key: 'Features', value: 'Mixing Ball, Leak-Proof' },
      { key: 'Measurement', value: 'ml & oz markings' },
    ],
  });

  // ========================
  // BOOKS (5 products)
  // ========================
  await createProduct({
    name: 'Atomic Habits by James Clear - Paperback',
    brand: 'Penguin Random House',
    description: 'An international bestseller on building good habits and breaking bad ones. James Clear reveals practical strategies that will teach you exactly how to form good habits and make remarkable changes.',
    originalPrice: 799,
    sellingPrice: 399,
    discountPercent: 50,
    stock: 500,
    rating: 4.6,
    ratingCount: 123456,
    categoryId: books.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Author', value: 'James Clear' },
      { key: 'Publisher', value: 'Penguin Random House' },
      { key: 'Language', value: 'English' },
      { key: 'Pages', value: '320' },
      { key: 'Binding', value: 'Paperback' },
      { key: 'Genre', value: 'Self-Help' },
    ],
  });

  await createProduct({
    name: 'The Psychology of Money by Morgan Housel',
    brand: 'Jaico Publishing House',
    description: 'Timeless lessons on wealth, greed, and happiness. Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life\'s most important topics.',
    originalPrice: 399,
    sellingPrice: 250,
    discountPercent: 37,
    stock: 350,
    rating: 4.5,
    ratingCount: 98765,
    categoryId: books.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Author', value: 'Morgan Housel' },
      { key: 'Publisher', value: 'Jaico Publishing House' },
      { key: 'Language', value: 'English' },
      { key: 'Pages', value: '252' },
      { key: 'Binding', value: 'Paperback' },
      { key: 'Genre', value: 'Finance, Self-Help' },
    ],
  });

  await createProduct({
    name: 'Rich Dad Poor Dad by Robert T. Kiyosaki',
    brand: 'Plata Publishing',
    description: 'The #1 personal finance book of all time. Robert Kiyosaki shares the story of his two dads — and the importance of financial literacy. A must-read for anyone seeking to gain financial independence.',
    originalPrice: 499,
    sellingPrice: 299,
    discountPercent: 40,
    stock: 400,
    rating: 4.5,
    ratingCount: 112345,
    categoryId: books.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Author', value: 'Robert T. Kiyosaki' },
      { key: 'Publisher', value: 'Plata Publishing' },
      { key: 'Language', value: 'English' },
      { key: 'Pages', value: '336' },
      { key: 'Binding', value: 'Paperback' },
      { key: 'Genre', value: 'Personal Finance' },
    ],
  });

  await createProduct({
    name: 'Ikigai: The Japanese Secret to a Long and Happy Life',
    brand: 'Penguin Books',
    description: 'Discover the Japanese concept of ikigai — the happiness of always being busy — that brings satisfaction, happiness, and meaning to life. A beautifully illustrated guide.',
    originalPrice: 350,
    sellingPrice: 199,
    discountPercent: 43,
    stock: 300,
    rating: 4.4,
    ratingCount: 87654,
    categoryId: books.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Author', value: 'Héctor García, Francesc Miralles' },
      { key: 'Publisher', value: 'Penguin Books' },
      { key: 'Language', value: 'English' },
      { key: 'Pages', value: '208' },
      { key: 'Binding', value: 'Paperback' },
      { key: 'Genre', value: 'Self-Help, Philosophy' },
    ],
  });

  await createProduct({
    name: 'The Alchemist by Paulo Coelho - 25th Anniversary Edition',
    brand: 'HarperOne',
    description: 'A magical fable about following your dreams. Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
    originalPrice: 350,
    sellingPrice: 199,
    discountPercent: 43,
    stock: 350,
    rating: 4.4,
    ratingCount: 95432,
    categoryId: books.id,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=400&fit=crop',
    ],
    specifications: [
      { key: 'Author', value: 'Paulo Coelho' },
      { key: 'Publisher', value: 'HarperOne' },
      { key: 'Language', value: 'English' },
      { key: 'Pages', value: '197' },
      { key: 'Binding', value: 'Paperback' },
      { key: 'Genre', value: 'Fiction, Philosophy' },
    ],
  });

  console.log('✅ 43 products seeded across 8 categories');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
