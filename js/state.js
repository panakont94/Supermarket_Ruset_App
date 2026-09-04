import { seedData } from './data.js';
import { loadState, saveState } from './storage.js';

const defaultState = {
  users: seedData.users,
  categories: seedData.categories,
  products: seedData.products,
  sales: seedData.sales,
  session: null,
  cart: []
};

const savedState = loadState();
export const state = savedState ? savedState : structuredClone(defaultState);

export function persistState() {
  saveState(state);
}

export function resetDemoData() {
  const freshState = structuredClone(defaultState);
  Object.assign(state, freshState);
  persistState();
}

export function setSession(session) {
  state.session = session;
  persistState();
}

export function getCurrentUser() {
  return state.session ? state.session.user : null;
}

export function addToCart(productId, qty = 1) {
  const itemIndex = state.cart.findIndex(item => item.productId === productId);

  if (itemIndex >= 0) {
    state.cart[itemIndex].qty += qty;
  } else {
    const product = state.products.find(item => item.id === productId);
    if (!product) return null;

    state.cart.push({
      productId,
      name: product.name,
      price: product.price,
      qty
    });
  }

  persistState();
  return state.cart;
}

export function updateCartItem(productId, qty) {
  state.cart = state.cart
    .map(item => item.productId === productId ? { ...item, qty: Math.max(0, qty) } : item)
    .filter(item => item.qty > 0);

  persistState();
  return state.cart;
}

export function clearCart() {
  state.cart = [];
  persistState();
}

export function addSale(sale) {
  state.sales.unshift(sale);
  persistState();
  return sale;
}

export function updateProductQuantity(productId, newQty) {
  const product = state.products.find(item => item.id === productId);
  if (!product) return null;

  product.quantity = Math.max(0, newQty);
  product.updatedAt = new Date().toISOString();
  persistState();
  return product;
}

export function getProductById(productId) {
  return state.products.find(product => product.id === productId) || null;
}

export function getCategoryName(categoryId) {
  const category = state.categories.find(item => item.id === categoryId);
  return category ? category.name : 'Uncategorized';
}

export function getStatusBadge(product) {
  if (product.quantity === 0) return 'Out of Stock';
  if (product.quantity <= product.minStock) return 'Low Stock';
  const expiry = new Date(product.expiryDate);
  const now = new Date();
  const msInDay = 1000 * 60 * 60 * 24;
  const daysLeft = (expiry - now) / msInDay;
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= 30) return 'Expiring Soon';
  return 'In Stock';
}
