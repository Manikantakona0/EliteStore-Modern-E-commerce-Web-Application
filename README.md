# 🛒 FlipkartStore — Premium E-commerce Website

A fully functional, responsive e-commerce frontend built with vanilla HTML, CSS, and JavaScript. Features product browsing, filtering, cart management, and user authentication — all running in the browser without any backend.

---

## 🚀 Live Demo

> Open `index.html` directly in your browser — no server setup required.

---

## 📸 Screenshots

| Home Page | Products Page | Cart |
|-----------|--------------|------|
| Hero section with category grid | Filter & sort by category/price/rating | Add to cart, quantity controls, order summary |

---

## ✨ Features

- **Product Catalog** — 7,000+ products across 6 categories (Electronics, Fashion, Home & Garden, Baby Products, Sports, Beauty)
- **Search** — Real-time search by name, brand, or category
- **Filters** — Filter by category, price range; sort by name, price, rating
- **Product Detail Page** — Full product view with rating, discount badge, stock status
- **Shopping Cart** — Add/remove items, update quantities, order summary with tax calculation
- **User Auth** — Sign in / Sign up flow (mock, stored in localStorage)
- **Wishlist** — Add products to wishlist (UI ready)
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Persistent Cart** — Cart saved to localStorage across sessions

---

## 🗂️ Project Structure

```
flipkartstore/
├── index.html        # Main HTML — all pages rendered as sections
├── styles.css        # All styles including responsive breakpoints
├── script.js         # App logic: routing, cart, filters, auth
├── products.json     # Product dataset (~7,600 products)
└── README.md
```

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, single-page layout
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No frameworks or libraries
- **Font Awesome 6** — Icons
- **localStorage** — Cart and user session persistence

---

## ⚠️ Known Limitations

### Product Images
Product images are sourced from **Amazon CDN** (`m.media-amazon.com`). Amazon applies hotlink protection, so images may not load when the project is opened locally or hosted on a third-party server. A placeholder image is shown automatically when an image fails to load.

**To fix for production:** Replace Amazon image URLs with your own hosted images or use a free image CDN like [Cloudinary](https://cloudinary.com) or [Unsplash](https://unsplash.com).

### Authentication
Authentication is **mock-only** — no real backend. User data is stored in `localStorage`. Passwords are not hashed or validated server-side.

### Products JSON Size
`products.json` is ~5MB and loads entirely on page start. For production, implement pagination or a backend API.

### Prices
Product prices are stored as raw numbers from the original dataset. All prices are displayed in **Indian Rupees (₹)**.

---

## 🏃 Running Locally

Just open `index.html` in your browser:

```bash
# Option 1: Direct open
open index.html

# Option 2: Use a local server (recommended to avoid CORS issues with products.json)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

---

## 📋 TODO / Improvements

- [ ] Replace Amazon image URLs with self-hosted images
- [ ] Add backend (Node.js/Firebase) for real auth and orders
- [ ] Implement pagination for products list
- [ ] Complete wishlist feature (save to localStorage)
- [ ] Add product reviews section
- [ ] Implement checkout flow with address form
- [ ] Add dark mode toggle
- [ ] Write unit tests for cart logic

---

## 👨‍💻 Author

Built as a frontend portfolio project. Feel free to fork and improve!

---

## 📄 License

MIT License — free to use and modify.
