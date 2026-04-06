// Product Data
const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'home', name: 'Home & Garden', icon: '🏠' },
    { id: 'baby', name: 'Baby Products', icon: '🍼' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
];


// Category mapping function

  function mapCategory(cat, name = "") {
  const text = (cat + " " + name).toLowerCase();

  // SPORTS
  if (
    text.includes("sport") ||
    text.includes("ball") ||
    text.includes("bat") ||
    text.includes("cricket") ||
    text.includes("football") ||
    text.includes("badminton") ||
    text.includes("racket") ||
    text.includes("tennis") ||
    text.includes("hockey") ||
    text.includes("gym") ||
    text.includes("dumbbell") ||
    text.includes("fitness") ||
    text.includes("exercise") ||
    text.includes("yoga")
  ) return "sports";

  // HOME
  if (
    text.includes("kitchen") ||
    text.includes("home") ||
    text.includes("furniture") ||
    text.includes("appliance") ||
    text.includes("cookware") ||
    text.includes("utensil") ||
    text.includes("decor") ||
    text.includes("improvement") ||
    text.includes("storage")
  ) return "home";

  // BABY
  if (
    text.includes("baby") ||
    text.includes("kids") ||
    text.includes("kid") ||
    text.includes("toy") ||
    text.includes("school bag") ||
    text.includes("schoolbag") ||
    text.includes("diaper") ||
    text.includes("feeding") ||
    text.includes("stroller")
  ) return "baby";

  // ELECTRONICS
  if (
    text.includes("camera") ||
    text.includes("phone") ||
    text.includes("mobile") ||
    text.includes("laptop") ||
    text.includes("speaker") ||
    text.includes("television") ||
    text.includes("tv") ||
    text.includes("refrigerator") ||
    text.includes("headphone") ||
    text.includes("earbud") ||
    text.includes("electronic")
  ) return "electronics";

  // FASHION
  if (
    text.includes("men") ||
    text.includes("women") ||
    text.includes("shirt") ||
    text.includes("dress") ||
    text.includes("jeans") ||
    text.includes("wear") ||
    text.includes("fashion") ||
    text.includes("handbag") ||
    text.includes("bag") ||
    text.includes("shoe") ||
    text.includes("sandal")
  ) return "fashion";

  // BEAUTY
  if (
    text.includes("beauty") ||
    text.includes("makeup") ||
    text.includes("make-up") ||
    text.includes("cosmetic") ||
    text.includes("cream") ||
    text.includes("serum") ||
    text.includes("skincare") ||
    text.includes("lotion")
  ) return "beauty";

  return "baby";
}

function formatINR(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}



let products = [];

// Load products dataset
fetch('products.json')
  .then(res => res.json())
  .then(data => {

    products = data.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      originalPrice: Number(p.originalPrice),
      image: p.image,
      brand: p.brand,
      rating: p.rating,
      reviewCount: p.reviewCount,
      inStock: true,
      category: mapCategory(p.category, p.name)
    }));

    console.log("Loaded products:", products.length);

    renderFeaturedProducts();
    initializeProductsPage();
  });



// Application State
let currentPage = 'home';
let currentCategory = null;
let currentProduct = null;
let cart = [];
let user = null;
let isAuthenticated = false;
let filters = {
    categories: [],
    priceRange: 500000,
    sortBy: 'name'
};

// DOM Elements
const pages = {
    home: document.getElementById('homePage'),
    products: document.getElementById('productsPage'),
    productDetail: document.getElementById('productDetailPage'),
    cart: document.getElementById('cartPage'),
    auth: document.getElementById('authPage')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderCategories();
    renderFeaturedProducts();
    updateCartUI();
});

function initializeApp() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('elitestore_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    // Load user from localStorage
    const savedUser = localStorage.getItem('elitestore_user');
    if (savedUser) {
        user = JSON.parse(savedUser);
        isAuthenticated = true;
        updateUserUI();
    }

    showPage('home');
}

function setupEventListeners() {
    // Navigation
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-page')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            showPage(page);
        }

        if (e.target.hasAttribute('data-category')) {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            showProductsPage(category);
        }

        if (e.target.hasAttribute('data-product')) {
            e.preventDefault();
            const productId = e.target.getAttribute('data-product');
            showProductDetail(productId);
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });

    // Cart button
    document.getElementById('cartBtn').addEventListener('click', function() {
        showPage('cart');
    });

    // User button
    document.getElementById('userBtn').addEventListener('click', function() {
        if (isAuthenticated) {
            logout();
        } else {
            showPage('auth');
        }
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();

    // empty → show all
    if (!query) {
        showProductsPage(currentCategory);
        renderProducts(getFilteredProducts());
        return;
    }

    // always open products page for search
    showPage('products');

    const filtered = products.filter(product => {
        const name = product.name.toLowerCase();
        const brand = product.brand.toLowerCase();
        const category = product.category.toLowerCase();

        if (name.includes(query) || brand.includes(query) || category.includes(query)) {
            return true;
        }

        const words = name.split(" ");
        return words.some(w => w.includes(query));
    });

    renderProducts(filtered);
});


    // Products page filters
    setupProductsPageListeners();

    // Auth form
    setupAuthListeners();
}

function setupProductsPageListeners() {
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            filters.sortBy = this.value;
            renderProducts(getFilteredProducts());
        });
    }

    // Price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            filters.priceRange = parseInt(this.value);
            document.getElementById('maxPrice').textContent = formatINR(this.value);
            renderProducts(getFilteredProducts());
        });
    }

    // Filter button (mobile)
    const filterBtn = document.getElementById('filterBtn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    if (filterBtn && filtersSidebar) {
        filterBtn.addEventListener('click', function() {
            filtersSidebar.classList.toggle('active');
        });
    }

    // View mode buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // View mode functionality can be implemented here
        });
    });
}

function setupAuthListeners() {
    const authForm = document.getElementById('authForm');
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    const passwordToggle = document.getElementById('passwordToggle');

    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAuth();
        });
    }

    if (authSwitchBtn) {
        authSwitchBtn.addEventListener('click', function() {
            toggleAuthMode();
        });
    }

    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('passwordInput');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-off';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
}

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        if (page) page.classList.remove('active');
    });

    // Show selected page
    if (pages[pageName]) {
        pages[pageName].classList.add('active');
        currentPage = pageName;
    }

    // Update navigation
    updateNavigation(pageName);

    // Page-specific initialization
    switch (pageName) {
        case 'products':
            initializeProductsPage();
            break;
        case 'cart':
            renderCart();
            break;
        case 'auth':
            initializeAuthPage();
            break;
    }
}

function updateNavigation(activePage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');
        }
    });
}

// Products Page
function showProductsPage(category = null) {
    currentCategory = category;

    // reset sidebar filters
    filters.categories = [];

    // clear search text
    const searchBox = document.getElementById('searchInput');
    if (searchBox) searchBox.value = "";

    // nav active highlight
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const link = document.querySelector(`[data-category="${category}"]`);
    if (link) link.classList.add('active');

    showPage('products');
}

function initializeProductsPage() {
    renderCategoryFilters();
    renderProducts(getFilteredProducts());
    updateProductsHeader();
}

function renderCategoryFilters() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;

    categoryFilters.innerHTML = categories.map(category => `
        <div class="filter-option">
            <input type="checkbox" id="category-${category.id}" value="${category.id}" 
                   ${filters.categories.includes(category.id) ? 'checked' : ''}>
            <label for="category-${category.id}">${category.name}</label>
        </div>
    `).join('');

    // Add event listeners
    categoryFilters.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        const categoryId = e.target.value;

        // RESET navbar category filter
        currentCategory = null;

        if (e.target.checked) {
            filters.categories.push(categoryId);
        } else {
            filters.categories = filters.categories.filter(id => id !== categoryId);
        }

        renderProducts(getFilteredProducts());
        updateProductsHeader();
    }
});
}

function getFilteredProducts() {
    let filtered = [...products];

    // Filter by current category (from navigation)
    if (currentCategory) {
        filtered = filtered.filter(product => product.category === currentCategory);
    }

    // Filter by selected categories (from filters)
    if (filters.categories.length > 0) {
        filtered = filtered.filter(product => filters.categories.includes(product.category));
    }

    // Filter by price range
    filtered = filtered.filter(product => product.price <= filters.priceRange);

    // Sort products
    filtered.sort((a, b) => {
        switch (filters.sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    return filtered;
}

function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    if (!productsGrid) return;

    if (productsToRender.length === 0) {
        productsGrid.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }

    productsGrid.style.display = 'grid';
    noProducts.style.display = 'none';

    productsGrid.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
    updateProductsCount(productsToRender.length);
}

function updateProductsHeader() {
    const productsTitle = document.getElementById('productsTitle');
    const categoryName = currentCategory ? 
        categories.find(cat => cat.id === currentCategory)?.name : 'All Products';
    
    if (productsTitle) {
        productsTitle.textContent = categoryName || 'All Products';
    }
}

function updateProductsCount(count) {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) {
        productsCount.textContent = `${count} products found`;
    }
}

// Product Detail Page
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    showPage('productDetail');
    renderProductDetail(product);
}

function renderProductDetail(product) {
    const productDetail = document.getElementById('productDetail');
    const breadcrumb = document.getElementById('productBreadcrumb');
    
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }

    if (!productDetail) return;

    const images = product.images || [product.image];
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    productDetail.innerHTML = `
        <div class="product-images">
            <div class="main-image">
                <img src="${images[0]}" alt="${product.name}" id="mainProductImage">
            </div>
            ${images.length > 1 ? `
                <div class="thumbnail-images">
                    ${images.map((image, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${image}', ${index})">
                            <img src="${image}" alt="${product.name} ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <div class="product-details">
            <p class="product-detail-brand">${product.brand}</p>
            <h1 class="product-detail-name">${product.name}</h1>
            
            <div class="product-detail-rating">
                <div class="stars">
                    ${createStars(product.rating)}
                </div>
                <span class="rating-text">${product.rating} (${product.reviewCount} reviews)</span>
            </div>

            <div class="product-detail-price">
                <div class="price-row">
                    <span class="detail-current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="detail-original-price">$${product.originalPrice}</span>` : ''}
                </div>
                ${product.originalPrice ? `<p class="savings">You save $${(product.originalPrice - product.price).toFixed(2)}</p>` : ''}
            </div>

            <p class="product-description">${product.description}</p>

            ${product.features ? `
                <div class="product-features">
                    <h3 class="features-title">Key Features:</h3>
                    <ul class="features-list">
                        ${product.features.map(feature => `
                            <li class="feature-item">
                                <div class="feature-bullet"></div>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="quantity-section">
                <div class="quantity-controls">
                    <span class="quantity-label">Quantity:</span>
                    <div class="quantity-input">
                        <button class="quantity-btn" onclick="changeQuantity(-1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value" id="productQuantity">1</span>
                        <button class="quantity-btn" onclick="changeQuantity(1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary add-to-cart-btn" onclick="addToCartFromDetail()" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="wishlist-detail-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>

            <div class="stock-indicator">
                <div class="stock-dot ${product.inStock ? 'in-stock' : 'out-of-stock'}"></div>
                <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>

            <div class="product-guarantees">
                <div class="guarantee">
                    <i class="fas fa-truck guarantee-icon shipping"></i>
                    <div>
                        <p class="guarantee-title">Free Shipping</p>
                        <p class="guarantee-description">On orders over $100</p>
                    </div>
                </div>
                <div class="guarantee">
                    <i class="fas fa-sync-alt guarantee-icon returns"></i>
                    <div>
                        <p class="guarantee-title">Easy Returns</p>
                        <p class="guarantee-description">30-day policy</p>
                    </div>
                </div>
                <div class="guarantee">
                    <i class="fas fa-shield-alt guarantee-icon warranty"></i>
                    <div>
                        <p class="guarantee-title">Warranty</p>
                        <p class="guarantee-description">1-year coverage</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function changeMainImage(imageSrc, index) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function changeQuantity(delta) {
    const quantityElement = document.getElementById('productQuantity');
    if (!quantityElement) return;
    
    let quantity = parseInt(quantityElement.textContent);
    quantity = Math.max(1, quantity + delta);
    quantityElement.textContent = quantity;
}

function addToCartFromDetail() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('productQuantity').textContent);
    for (let i = 0; i < quantity; i++) {
        addToCart(currentProduct);
    }
}

// Cart Management
function addToCart(product) {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCart();
    updateCartUI();
    if (currentPage === 'cart') {
        renderCart();
    }
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartUI();
            if (currentPage === 'cart') {
                renderCart();
            }
        }
    }
}

function saveCart() {
    localStorage.setItem('elitestore_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsCount = document.getElementById('cartItemsCount');
    
    if (!cartContent || !cartEmpty) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartItemsCount) {
        cartItemsCount.textContent = `${totalItems} items`;
    }

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }

    cartContent.style.display = 'grid';
    cartEmpty.style.display = 'none';

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-content">
                        <div class="cart-item-image" onclick="showProductDetail('${item.product.id}')">
                            <img src="${item.product.image}" alt="${item.product.name}">
                        </div>
                        <div class="cart-item-info">
                            <h3 class="cart-item-name" onclick="showProductDetail('${item.product.id}')">${item.product.name}</h3>
                            <p class="cart-item-brand">${item.product.brand}</p>
                            <p class="cart-item-price">$${item.product.price}</p>
                        </div>
                        <div class="cart-item-controls">
                            <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.product.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="cart-quantity-value">${item.quantity}</span>
                            <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.product.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-total">
                            <p class="cart-item-total-price">$${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart('${item.product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="cart-summary">
            <h2 class="cart-summary-title">Order Summary</h2>
            
            <div class="cart-summary-row">
                <span class="cart-summary-label">Subtotal (${totalItems} items)</span>
                <span class="cart-summary-value">$${subtotal.toFixed(2)}</span>
            </div>
            
            <div class="cart-summary-row">
                <span class="cart-summary-label">Shipping</span>
                <span class="cart-summary-value free">Free</span>
            </div>
            
            <div class="cart-summary-row">
                <span class="cart-summary-label">Tax</span>
                <span class="cart-summary-value">$${tax.toFixed(2)}</span>
            </div>
            
            <div class="cart-summary-total">
                <div class="cart-summary-row">
                    <span class="cart-summary-label">Total</span>
                    <span class="cart-summary-value">$${total.toFixed(2)}</span>
                </div>
            </div>

            <div class="cart-actions">
                <button class="btn btn-primary btn-full" onclick="proceedToCheckout()">
                    Proceed to Checkout
                    <i class="fas fa-arrow-right"></i>
                </button>
                <button class="btn btn-secondary btn-full" onclick="showPage('products')">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
}

function proceedToCheckout() {
    if (!isAuthenticated) {
        showNotification('Please sign in to proceed to checkout');
        showPage('auth');
        return;
    }
    
    // Simulate checkout process
    showLoading();
    setTimeout(() => {
        hideLoading();
        cart = [];
        saveCart();
        updateCartUI();
        showNotification('Order placed successfully!');
        showPage('home');
    }, 2000);
}

// Authentication
function initializeAuthPage() {
    resetAuthForm();
}

function toggleAuthMode() {
    const isLogin = document.getElementById('nameGroup').style.display === 'none';
    
    if (isLogin) {
        // Switch to register
        document.getElementById('nameGroup').style.display = 'block';
        document.getElementById('confirmPasswordGroup').style.display = 'block';
        document.getElementById('loginOptions').style.display = 'none';
        document.getElementById('authTitle').textContent = 'Create your account';
        document.getElementById('authDescription').textContent = 'Join us today and start shopping premium products.';
        document.getElementById('authSubmitBtn').textContent = 'Create account';
        document.getElementById('authSwitchText').textContent = 'Already have an account? ';
        document.getElementById('authSwitchBtn').textContent = 'Sign in';
    } else {
        // Switch to login
        document.getElementById('nameGroup').style.display = 'none';
        document.getElementById('confirmPasswordGroup').style.display = 'none';
        document.getElementById('loginOptions').style.display = 'flex';
        document.getElementById('authTitle').textContent = 'Sign in to your account';
        document.getElementById('authDescription').textContent = 'Welcome back! Please enter your details.';
        document.getElementById('authSubmitBtn').textContent = 'Sign in';
        document.getElementById('authSwitchText').textContent = "Don't have an account? ";
        document.getElementById('authSwitchBtn').textContent = 'Sign up';
    }
}

function handleAuth() {
    const isLogin = document.getElementById('nameGroup').style.display === 'none';
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const name = document.getElementById('nameInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;

    if (!email || !password) {
        showNotification('Please fill in all required fields');
        return;
    }

    if (!isLogin) {
        if (!name) {
            showNotification('Please enter your name');
            return;
        }
        if (password !== confirmPassword) {
            showNotification('Passwords do not match');
            return;
        }
    }

    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        // Mock successful authentication
        user = {
            id: '1',
            name: isLogin ? 'John Doe' : name,
            email: email,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
        };
        
        isAuthenticated = true;
        localStorage.setItem('elitestore_user', JSON.stringify(user));
        updateUserUI();
        showNotification(isLogin ? 'Welcome back!' : 'Account created successfully!');
        showPage('home');
    }, 1000);
}

function logout() {
    user = null;
    isAuthenticated = false;
    localStorage.removeItem('elitestore_user');
    updateUserUI();
    showNotification('Logged out successfully');
}

function updateUserUI() {
    const userBtn = document.getElementById('userBtn');
    const userText = userBtn.querySelector('.user-text');
    
    if (isAuthenticated && user) {
        userText.textContent = user.name;
    } else {
        userText.textContent = 'Sign In';
    }
}

function resetAuthForm() {
    document.getElementById('authForm').reset();
    document.getElementById('nameGroup').style.display = 'none';
    document.getElementById('confirmPasswordGroup').style.display = 'none';
    document.getElementById('loginOptions').style.display = 'flex';
    document.getElementById('authTitle').textContent = 'Sign in to your account';
    document.getElementById('authDescription').textContent = 'Welcome back! Please enter your details.';
    document.getElementById('authSubmitBtn').textContent = 'Sign in';
    document.getElementById('authSwitchText').textContent = "Don't have an account? ";
    document.getElementById('authSwitchBtn').textContent = 'Sign up';
}

// Utility Functions
function createProductCard(product) {
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            ${discountPercentage > 0 ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
            
            <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${product.id}')">
                <i class="fas fa-heart"></i>
            </button>

            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                
                <div class="quick-add-overlay">
                    <button class="quick-add-btn" onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-shopping-cart"></i>
                        Quick Add
                    </button>
                </div>
            </div>

            <div class="product-info">
                <p class="product-brand">${product.brand}</p>
                <h3 class="product-name">${product.name}</h3>
                
                <div class="product-rating">
                    <div class="stars">
                        ${createStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviewCount})</span>
                </div>

                <div class="product-price">
                   <span class="current-price">${formatINR(product.price)}</span>
                   ${product.originalPrice ? `<span class="original-price">${formatINR(product.originalPrice)}</span>` : ''}
                </div>

                <div class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
            </div>
        </div>
    `;
}

function createStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fas fa-star star filled"></i>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt star filled"></i>';
        } else {
            starsHTML += '<i class="fas fa-star star"></i>';
        }
    }
    
    return starsHTML;
}

function renderCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = categories.map(category => `
        <a href="#" class="category-card" data-category="${category.id}">
            <div class="category-icon">${category.icon}</div>
            <h3 class="category-name">${category.name}</h3>
        </a>
    `).join('');
}

function renderFeaturedProducts() {
    const featuredProducts = document.getElementById('featuredProducts');
    if (!featuredProducts) return;

    const featured = products.slice(0, 4);
    featuredProducts.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function toggleWishlist(productId) {
    // Wishlist functionality can be implemented here
    showNotification('Added to wishlist!');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1e40af;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}