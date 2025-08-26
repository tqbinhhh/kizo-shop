// Dữ liệu sản phẩm mẫu
const products = [
  {
    id: 1,
    name: "Tees basic nam",
    price: 450000,
    category: "ao",
    image: "./assets/photos/thun nam basic.webp",
    description: "Áo thun nam chất liệu cotton cao cấp, thoáng mát, dễ mặc"
  },
  {
    id: 2,
    name: " Short jeans",
    price: 250000,
    category: "quan",
    image: "./assets/photos/short.png",
    description: "Quần jean nam dáng slim fit, chất liệu denim bền đẹp"
  },
  {
    id: 6,
    name: "Hoodie",
    price: 485000,
    category: "ao",
    image: "./assets/photos/Hoodie.webp",
    description: "Áo Hoodie"
  },
  {
    id: 7,
    name: "NY SWEATPANTS",
    price: 880000,
    category: "quan",
    image: "./assets/photos/NY SWEATPANTS.jpg",
    description: "Quần tây nam công sở, dáng đứng, lịch lãm"
  },
  {
    id: 10,
    name: "Balo MLB",
    price: 2450000,
    category: "tui",
    image: "./assets/photos/balo mlb.webp",
    description: "Balo bền đẹp, nhiều ngăn tiện lợi"
  },
  {
    id: 11,
    name: "Mũ MLB",
    price: 820000,
    category: "phukien",
    image: "./assets/photos/mu bong chay.jpg",
    description: "Mũ bóng chày thời trang, bảo vệ khỏi ánh nắng"
  },
];

// Giỏ hàng
let cart = [];
let currentProducts = [...products];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const clearCart = document.getElementById('clearCart');
const checkout = document.getElementById('checkout');
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const newsletterEmail = document.getElementById('newsletterEmail');
const userActionsDiv = document.getElementById('userActions');

// Authentication state
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
  displayProducts();
  setupEventListeners();
  updateCartDisplay();
  initializeAnimations();
  updateAuthUI();
});

// Thiết lập event listeners
function setupEventListeners() {
  // Giỏ hàng
  cartIcon.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartSidebar);
  cartOverlay.addEventListener('click', closeCartSidebar);
  clearCart.addEventListener('click', clearCartItems);
  checkout.addEventListener('click', processCheckout);

  // Bộ lọc
  categoryFilter.addEventListener('change', filterProducts);
  priceFilter.addEventListener('change', filterProducts);
  sortFilter.addEventListener('change', filterProducts);

  // Load more
  loadMoreBtn.addEventListener('click', loadMoreProducts);

  // Newsletter
  newsletterEmail.addEventListener('input', function() {
    if (this.value) {
      this.style.borderColor = '#667eea';
    } else {
      this.style.borderColor = '#dee2e8';
    }
  });

  // Hamburger menu toggle for mobile
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const userActions = document.querySelector('.user-actions');

  if (hamburger && navMenu) {
      hamburger.addEventListener('click', function() {
          navMenu.classList.toggle('active');
          hamburger.classList.toggle('active');
          userActions.classList.toggle('active');
      });

      // Close menu when clicking on a link
      navMenu.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', () => {
              navMenu.classList.remove('active');
              hamburger.classList.remove('active');
              userActions.classList.remove('active');
          });
      });
  }
}

// Hiển thị sản phẩm
function displayProducts(productsToShow = currentProducts.slice(0, 8)) {
  productsGrid.innerHTML = '';
  
  productsToShow.forEach(product => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });

  updateAuthUI();

  // Ẩn/hiện nút "Xem thêm"
  loadMoreBtn.style.display = currentProducts.length > 8 ? 'block' : 'none';
}

// Tạo card sản phẩm
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  const addToCartBtn = isAuthenticated 
    ? `<button class="add-to-cart" onclick="addToCart(${product.id})">
         <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
       </button>`
    : `<button class="add-to-cart" disabled style="opacity: 0.5; cursor: not-allowed;">
         <i class="fas fa-lock"></i> Đăng nhập để mua
       </button>`;
  
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
      <div class="product-actions">
        ${addToCartBtn}
      </div>
    </div>
  `;
  return card;
}

// Lọc sản phẩm
function filterProducts() {
  const category = categoryFilter.value;
  const priceRange = priceFilter.value;
  const sortBy = sortFilter.value;

  let filtered = [...products];

  // Lọc theo danh mục
  if (category) {
    filtered = filtered.filter(product => product.category === category);
  }

  // Lọc theo giá
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (max) {
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    } else {
      filtered = filtered.filter(product => product.price >= min);
    }
  }

  // Sắp xếp
  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => b.id - a.id);
      break;
    case 'popular':
    default:
      // Giữ nguyên thứ tự mặc định
      break;
  }

  currentProducts = filtered;
  displayProducts();
}

// Load thêm sản phẩm
function loadMoreProducts() {
  const currentCount = productsGrid.children.length;
  const nextBatch = currentProducts.slice(currentCount, currentCount + 4);
  
  nextBatch.forEach(product => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });
  
  updateAuthUI();

  // Ẩn nút nếu đã hiển thị hết
  if (currentCount + nextBatch.length >= currentProducts.length) {
    loadMoreBtn.style.display = 'none';
  }
}

// Giỏ hàng functions
function addToCart(productId) {
  if (!isAuthenticated) {
    showNotification('Vui lòng đăng nhập để mua sắm!', 'warning');
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCartDisplay();
  showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartDisplay();
    }
  }
}

function updateCartDisplay() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Giỏ hàng trống</p>';
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white;">×</button>
      `;
      cartItems.appendChild(cartItem);
    });
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = formatPrice(total);
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = 'auto';
}

function clearCartItems() {
  cart = [];
  updateCartDisplay();
  showNotification('Đã xóa giỏ hàng!', 'info');
}

function processCheckout() {
  if (cart.length === 0) {
    showNotification('Giỏ hàng trống!', 'error');
    return;
  }
  
  localStorage.setItem('checkoutCart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  `;

  switch (type) {
    case 'success':
      notification.style.background = '#27ae60';
      break;
    case 'error':
      notification.style.background = '#e74c3c';
      break;
    case 'warning':
      notification.style.background = '#f39c12';
      break;
    default:
      notification.style.background = '#000000';
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function updateAuthUI() {
  if (isAuthenticated && currentUser) {
    userActionsDiv.innerHTML = `
      <span class="user-name">${currentUser.name}</span>
      <button class="btn btn-secondary" id="logoutBtn">Đăng xuất</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);
    enableShoppingFeatures();
  } else {
    userActionsDiv.innerHTML = `
      <a class="btn btn-secondary" href="auth.html?form=login">Đăng nhập</a>
      <a class="btn btn-primary" href="auth.html?form=register">Đăng ký</a>
    `;
    disableShoppingFeatures();
  }
}

function logout() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
  isAuthenticated = false;
  currentUser = null;
  updateAuthUI();
  showNotification('Đã đăng xuất!', 'info');
}

function enableShoppingFeatures() {
  const addToCartBtns = document.querySelectorAll('.product-card .add-to-cart');
  addToCartBtns.forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Thêm vào giỏ';
  });
}

function disableShoppingFeatures() {
  const addToCartBtns = document.querySelectorAll('.product-card .add-to-cart');
  addToCartBtns.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.innerHTML = '<i class="fas fa-lock"></i> Đăng nhập để mua';
  });
}

function initializeAnimations() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  let countersAnimated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        if (entry.target.classList.contains('hero') && !countersAnimated) {
          animateCounters();
          countersAnimated = true;
        }
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.category-card, .product-card, .about-content, .section-header, .hero').forEach(el => {
    observer.observe(el);
  });
  
  typeWriterEffect();
}

function typeWriterEffect() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  const originalHTML = title.innerHTML;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  title.innerHTML = '';
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < textContent.length) {
      let newHTML = '';
      let charCount = 0;
      for (let j = 0; j < originalHTML.length; j++) {
        if (originalHTML[j] === '<') {
          let tagEnd = originalHTML.indexOf('>', j);
          if (tagEnd !== -1) {
            newHTML += originalHTML.substring(j, tagEnd + 1);
            j = tagEnd;
          }
        } else if (originalHTML[j] !== '>' && originalHTML[j] !== '/') {
          if (charCount < i + 1) {
            newHTML += originalHTML[j];
            charCount++;
          } else {
            newHTML += '&nbsp;';
          }
        } else {
          newHTML += originalHTML[j];
        }
      }
      title.innerHTML = newHTML;
      i++;
    } else {
      title.innerHTML = originalHTML;
      clearInterval(typeInterval);
    }
  }, 100);
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const originalText = counter.textContent;
    const target = parseInt(originalText.replace(/[^\d]/g, ''));
    const suffix = originalText.replace(/[\d]/g, '');
    if (isNaN(target)) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    };
    updateCounter();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .animate-in { animation: slideInUp 0.8s ease-out forwards; }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .product-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .product-card:hover { transform: translateY(-10px) scale(1.02); }
    .category-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .category-card:hover { transform: translateY(-15px) scale(1.05); }
    .btn { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .btn:hover { transform: translateY(-3px); }
  `;
  document.head.appendChild(style);
});
