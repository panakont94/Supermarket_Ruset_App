import { state, getCurrentUser } from './state.js';

const screens = {
  login: document.getElementById('loginScreen'),
  dashboard: document.getElementById('dashboardScreen')
};

const navButtons = {
  cashier: document.getElementById('navCashier'),
  warehouse: document.getElementById('navWarehouse'),
  ceo: document.getElementById('navCeo')
};

const dashboardViews = {
  cashier: document.getElementById('cashierScreen'),
  warehouse: document.getElementById('warehouseScreen'),
  ceo: document.getElementById('ceoScreen')
};

export function initRouter() {
  const user = getCurrentUser();
  if (!user) {
    showLogin();
    return;
  }

  showDashboard(user.role);
}

export function showLogin() {
  document.body.classList.remove('logged-in');
  if (screens.login) {
    screens.login.style.display = 'flex';
    screens.login.classList.add('active');
  }
  if (screens.dashboard) {
    screens.dashboard.style.display = 'none';
    screens.dashboard.classList.remove('active');
  }
}

export function showDashboard(role) {
  const user = getCurrentUser();
  if (!user) {
    showLogin();
    return;
  }

  document.body.classList.add('logged-in');
  if (screens.login) {
    screens.login.style.display = 'none';
    screens.login.classList.remove('active');
  }
  if (screens.dashboard) {
    screens.dashboard.style.display = 'block';
    screens.dashboard.classList.add('active');
  }

  Object.entries(navButtons).forEach(([key, button]) => {
    if (!button) return;
    const visible = key === 'ceo' ? true : user.role === key || user.role === 'ceo';
    button.style.display = visible ? 'inline-flex' : 'none';
    button.classList.toggle('active', key === role || (role === 'ceo' && key === 'ceo'));
  });

  Object.entries(dashboardViews).forEach(([key, view]) => {
    if (!view) return;
    const allowed = key === 'ceo' ? user.role === 'ceo' : user.role === key || user.role === 'ceo';
    view.style.display = allowed ? 'block' : 'none';
    if (allowed) view.classList.add('active'); else view.classList.remove('active');
  });

  const activeView = dashboardViews[role] || dashboardViews.ceo;
  if (activeView) {
    Object.values(dashboardViews).forEach(view => {
      if (view) view.style.display = view === activeView ? 'block' : 'none';
    });
  }
}

export function logoutAndRedirect() {
  localStorage.removeItem('supermarket-ruset-state');
  state.session = null;
  state.cart = [];
  showLogin();
}
