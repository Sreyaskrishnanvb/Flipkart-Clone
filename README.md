# Flipkart Clone - E-Commerce Application

A full-stack e-commerce application that closely replicates Flipkart's UI design and core shopping functionality. Built as an academic project to demonstrate proficiency in modern web development technologies.

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js (Vite) | Single Page Application |
| **Backend** | Node.js + Express.js | REST API Server |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | Prisma | Database access & migrations |
| **HTTP Client** | Axios | Frontend API communication |
| **Routing** | React Router v6 | Client-side routing |
| **Styling** | Vanilla CSS | Flipkart-accurate design system |

## 📋 Features

### Core Features (Implemented)
- ✅ **Product Listing Page** - Grid layout with Flipkart-style product cards, search, category filters, sorting, and pagination
- ✅ **Product Detail Page** - Image carousel, specifications, pricing with discount display, Add to Cart & Buy Now buttons
- ✅ **Shopping Cart** - View cart items, update quantities, remove items, price summary with discount/delivery breakdown
- ✅ **Order Placement** - Checkout with shipping address form (with validation), order summary, order confirmation page with order ID

### Bonus Features
- ✅ **Responsive Design** - Mobile, tablet, and desktop support
- ✅ **Order History** - View all past orders with details
- ❌ User Authentication (Default user assumed as per spec)
- ❌ Wishlist / Email notifications (Not required)

## 🗄 Database Schema

The database consists of **9 tables**:

- `users` - User accounts (default user seeded)
- `categories` - Product categories (8 categories)
- `products` - Product details with pricing, rating, stock
- `product_images` - Multiple images per product
- `product_specifications` - Key-value specifications
- `cart_items` - Shopping cart (unique user-product constraint)
- `orders` - Order records with totals and status
- `order_items` - Individual items in each order
- `shipping_addresses` - Delivery addresses linked to orders

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- npm

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Database Setup

```bash
cd server

# Create a PostgreSQL database named 'flipkart_clone'
# Update the DATABASE_URL in server/.env if needed:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flipkart_clone?schema=public"

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed the database with sample data (43 products, 8 categories)
npm run db:seed
```

### 3. Start the Application

```bash
# Terminal 1 - Start the backend (port 5000)
cd server
npm run dev

# Terminal 2 - Start the frontend (port 5173)
cd client
npm run dev
```

Visit **http://localhost:5173** to view the application.

## 📁 Project Structure

```
flipkart/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── CategoryBar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ImageCarousel.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   └── OrderHistoryPage.jsx
│   │   ├── api.js             # API service layer
│   │   ├── App.jsx            # Root component with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Complete design system
│   └── index.html
│
├── server/                    # Express.js Backend
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Seed data (43 products)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── products.js    # /api/products
│   │   │   ├── categories.js  # /api/categories
│   │   │   ├── cart.js        # /api/cart
│   │   │   └── orders.js      # /api/orders
│   │   └── index.js           # Server entry point
│   └── .env                   # Environment variables
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (supports `search`, `category`, `sort`, `minRating`, `page`, `limit`) |
| GET | `/api/products/:id` | Product detail with images & specs |
| GET | `/api/categories` | List all categories with product counts |
| GET | `/api/cart` | Get cart items with price summary |
| POST | `/api/cart` | Add item to cart (body: `{ productId, quantity }`) |
| PUT | `/api/cart/:id` | Update cart item quantity (body: `{ quantity }`) |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/orders` | Place order (body: `{ shippingAddress }`) |
| GET | `/api/orders` | Get order history |
| GET | `/api/orders/:id` | Get order details |

## 🎨 Design Decisions

- **UI**: Closely matches Flipkart's color scheme (#2874f0 blue, #ff9f00 yellow, #fb641b orange, #388e3c green) with Roboto font
- **No Auth**: A default user (ID: 1) is seeded and all operations use this user, as per the assignment spec
- **Indian Pricing**: All prices are in ₹ (INR) with realistic Indian market pricing
- **Transactional Orders**: Order placement uses a database transaction to ensure atomic stock updates and cart clearing
- **Responsive**: CSS media queries handle mobile (< 768px), tablet (< 1024px), and desktop layouts

## ⚠ Assumptions

1. A default user is always logged in (no authentication required)
2. Free delivery for orders above ₹500, ₹40 delivery fee otherwise
3. All product images use Flipkart CDN URLs (may require internet connectivity)
4. PostgreSQL is running locally on default port 5432
5. The application is for demonstration/academic purposes only
