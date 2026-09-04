import { login, logout, restoreSession } from './auth.js';
import { state, resetDemoData, getCurrentUser, persistState } from './state.js';
import { showDashboard, showLogin, initRouter } from './router.js';
import { renderProducts, populateCategoryFilter, renderCart, attachCashierEvents } from './cashier.js';
import { renderWarehouseTable, attachWarehouseEvents } from './warehouse.js';
import { renderCeoDashboard, attachCeoTabs } from './ceo.js';

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const headerUserName = document.getElementById('headerUserName');
const headerUserRole = document.getElementById('headerUserRole');
const demoLoginButtons = document.querySelectorAll('.demo-login');

function updateHeader() {
  const user = getCurrentUser();
  if (!user) {
    if (headerUserName) headerUserName.textContent = 'Guest';
    if (headerUserRole) headerUserRole.textContent = 'Not logged in';
    return;
  }

  if (headerUserName) headerUserName.textContent = user.name;
  if (headerUserRole) headerUserRole.textContent = user.role.toUpperCase();
}

function showError(message) {
  if (!loginError) return;
  loginError.textContent = message;
  loginError.style.display = 'block';
}

function hideError() {
  if (!loginError) return;
  loginError.style.display = 'none';
  loginError.textContent = '';
}

function handleLogin(username, password) {
  const response = login(username, password);

  if (!response.success) {
    showLogin();
    updateHeader();
    showError(response.message);
    return;
  }

  hideError();
  updateHeader();
  showDashboard(response.user.role);
  renderAll();
}

function renderAll() {
  populateCategoryFilter();
  renderProducts();
  renderCart();
  renderWarehouseTable();
  renderCeoDashboard();
}

function bindLogin() {
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      handleLogin(username, password);
    });
  }

  demoLoginButtons.forEach(button => {
    button.addEventListener('click', () => {
      const username = button.dataset.username;
      const password = button.dataset.password;
      handleLogin(username, password);
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      showLogin();
      updateHeader();
    });
  }
}

function setupModalCloseHandlers() {
  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.closeModal;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    });
  });
}

function bootstrap() {
  bindLogin();
  attachCashierEvents();
  attachWarehouseEvents();
  attachCeoTabs();
  setupModalCloseHandlers();

  const restoredUser = restoreSession();
  if (restoredUser) {
    updateHeader();
    showDashboard(restoredUser.role);
  } else {
    showLogin();
  }

  renderAll();
}

window.resetDemoData = resetDemoData;

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
