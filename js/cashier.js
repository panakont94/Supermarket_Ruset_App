import { state, getCurrentUser, addToCart, updateCartItem, clearCart, addSale, getProductById, persistState } from './state.js';
import { formatCurrency } from './validation.js';

const cartItemCount = document.getElementById('cartItemCount');
const cartItems = document.getElementById('cartItems');
const subtotalValue = document.getElementById('subtotalValue');
const taxValue = document.getElementById('taxValue');
const totalValue = document.getElementById('totalValue');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const productSearch = document.getElementById('productSearch');
const productCategoryFilter = document.getElementById('productCategoryFilter');
const productGrid = document.getElementById('productGrid');
const receiptModal = document.getElementById('receiptModal');
const receiptContent = document.getElementById('receiptContent');

export function renderProducts() {
  const products = state.products;
  const searchValue = (productSearch?.value || '').toLowerCase();
  const categoryValue = productCategoryFilter?.value || 'all';

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue) || product.sku.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === 'all' || product.categoryId === categoryValue;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-card-header">
        <span class="status-badge ${product.quantity === 0 ? 'status-out-of-stock' : 'status-in-stock'}">${product.quantity === 0 ? 'Out' : 'Available'}</span>
        <span class="muted">${product.sku}</span>
      </div>
      <div class="product-name">${product.name}</div>
      <div class="product-meta">${product.quantity} in stock</div>
      <div class="product-price">${formatCurrency(product.price)}</div>
      <div class="product-actions">
        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" type="button">Add</button>
      </div>
    </div>
  `).join('') || '<div class="empty-state">No products found.</div>';
}

export function populateCategoryFilter() {
  const categoryOptions = ['<option value="all">All categories</option>']
    .concat(state.categories.map(category => `<option value="${category.id}">${category.name}</option>`));

  if (productCategoryFilter) {
    productCategoryFilter.innerHTML = categoryOptions.join('');
  }
}

export function renderCart() {
  const items = state.cart;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (cartItemCount) cartItemCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
  if (subtotalValue) subtotalValue.textContent = formatCurrency(subtotal);
  if (taxValue) taxValue.textContent = formatCurrency(tax);
  if (totalValue) totalValue.textContent = formatCurrency(total);

  if (!cartItems) return;

  cartItems.innerHTML = items.length
    ? items.map(item => `
      <div class="card" style="padding: 0.8rem;">
        <div class="summary-row">
          <strong>${item.name}</strong>
          <button class="btn btn-danger" type="button" data-remove-cart-item="${item.productId}" style="padding: 0.3rem 0.5rem;">×</button>
        </div>
        <div class="summary-row">
          <span>${formatCurrency(item.price)} each</span>
          <div class="btn-row" style="gap:0.3rem;">
            <button class="btn btn-ghost" type="button" data-adjust-cart="${item.productId}" data-direction="decrease" style="padding:0.3rem 0.5rem;">-</button>
            <span>${item.qty}</span>
            <button class="btn btn-ghost" type="button" data-adjust-cart="${item.productId}" data-direction="increase" style="padding:0.3rem 0.5rem;">+</button>
          </div>
        </div>
      </div>
    `).join('')
    : '<div class="empty-state">Your cart is empty.</div>';
}

export function attachCashierEvents() {
  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-to-cart-btn');
    if (addButton) {
      const productId = addButton.dataset.productId;
      const product = getProductById(productId);
      if (!product) return;
      if (product.quantity <= 0) {
        alert('This product is out of stock.');
        return;
      }
      addToCart(productId, 1);
      renderCart();
    }

    const removeButton = event.target.closest('[data-remove-cart-item]');
    if (removeButton) {
      updateCartItem(removeButton.dataset.removeCartItem, 0);
      renderCart();
    }

    const adjustButton = event.target.closest('[data-adjust-cart]');
    if (adjustButton) {
      const { adjustCart: productId, direction } = adjustButton.dataset;
      const current = state.cart.find(item => item.productId === productId);
      if (!current) return;

      const nextQty = direction === 'increase' ? current.qty + 1 : current.qty - 1;
      updateCartItem(productId, nextQty);
      renderCart();
    }

    const closeModalButton = event.target.closest('[data-close-modal]');
    if (closeModalButton) {
      const modalId = closeModalButton.dataset.closeModal;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    }
  });

  if (productSearch) {
    productSearch.addEventListener('input', renderProducts);
  }

  if (productCategoryFilter) {
    productCategoryFilter.addEventListener('change', renderProducts);
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      clearCart();
      renderCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!state.cart.length) {
        alert('Add at least one product before checkout.');
        return;
      }

      const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const user = getCurrentUser();

      const sale = {
        id: `sale-${Date.now()}`,
        transactionId: `TXN-${Math.floor(Math.random() * 9000 + 1000)}`,
        cashierId: user.id,
        cashierName: user.name,
        items: state.cart.map(item => ({
          productId: item.productId,
          name: item.name,
          qty: item.qty,
          price: item.price,
          subtotal: item.price * item.qty
        })),
        total,
        paymentMethod: 'Cash',
        timestamp: new Date().toISOString()
      };

      state.cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.qty);
        }
      });

      addSale(sale);
      clearCart();
      renderProducts();
      renderCart();

      receiptContent.innerHTML = `
        <div class="receipt-line"><span>Receipt:</span><strong>${sale.transactionId}</strong></div>
        <div class="receipt-line"><span>Cashier:</span><span>${sale.cashierName}</span></div>
        ${sale.items.map(item => `
          <div class="receipt-line"><span>${item.name} x${item.qty}</span><span>${formatCurrency(item.subtotal)}</span></div>
        `).join('')}
        <div class="receipt-line"><span>Tax:</span><span>${formatCurrency(tax)}</span></div>
        <div class="receipt-line"><strong>Total:</strong><strong>${formatCurrency(total)}</strong></div>
      `;
      receiptModal.classList.add('active');
      persistState();
    });
  }
}
