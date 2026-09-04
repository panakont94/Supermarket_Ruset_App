import { users } from './data.js';
import { state, setSession, getCurrentUser, persistState } from './state.js';

export function login(username, password) {
  const user = users.find(
    item => item.username.toLowerCase() === String(username).trim().toLowerCase() && item.password === String(password).trim()
  );

  if (!user) {
    state.session = null;
    persistState();
    return { success: false, message: 'Invalid username or password.' };
  }

  const session = { user: { ...user } };
  setSession(session);
  return { success: true, user: session.user, message: 'Login successful.' };
}

export function logout() {
  state.session = null;
  state.cart = [];
  localStorage.setItem('supermarket-ruset-state', JSON.stringify(state));
}

export function isLoggedIn() {
  return Boolean(getCurrentUser());
}

export function hasAccess(role) {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === role || user.role === 'ceo';
}

export function requireRole(role) {
  return isLoggedIn() && hasAccess(role);
}

export function restoreSession() {
  const saved = JSON.parse(localStorage.getItem('supermarket-ruset-state') || '{}');
  if (saved && saved.session && saved.session.user) {
    state.session = saved.session;
    return saved.session.user;
  }
  return null;
}
