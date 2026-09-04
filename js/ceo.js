import { state } from './state.js';
import { formatCurrency } from './validation.js';

const ceoTotalRevenue = document.getElementById('ceoTotalRevenue');
const ceoLowStockCount = document.getElementById('ceoLowStockCount');
const ceoExpiringCount = document.getElementById('ceoExpiringCount');
const ceoInventoryValue = document.getElementById('ceoInventoryValue');
const ceoAlerts = document.getElementById('ceoAlerts');
const ceoProductsList = document.getElementById('ceoProductsList');
const ceoCategoriesList = document.getElementById('ceoCategoriesList');
const ceoSalesList = document.getElementById('ceoSalesList');
const ceoUsersList = document.getElementById('ceoUsersList');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = {
  overview: document.getElementById('ceoOverviewTab'),
  products: document.getElementById('ceoProductsTab'),
  categories: document.getElementById('ceoCategoriesTab'),
  sales: document.getElementById('ceoSalesTab'),
  users: document.getElementById('ceoUsersTab')
};

export function renderCeoDashboard() {
  const revenue = state.sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const lowStock = state.products.filter(product => product.quantity <= product.minStock).length;
  const expiring = state.products.filter(product => {
    const expiry = new Date(product.expiryDate);
    const diff = expiry - new Date();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= 30 && days >= 0;
  }).length;
  const inventoryValue = state.products.reduce((sum, product) => sum + product.quantity * product.cost, 0);

  if (ceoTotalRevenue) ceoTotalRevenue.textContent = formatCurrency(revenue);
  if (ceoLowStockCount) ceoLowStockCount.textContent = String(lowStock);
  if (ceoExpiringCount) ceoExpiringCount.textContent = String(expiring);
  if (ceoInventoryValue) ceoInventoryValue.textContent = formatCurrency(inventoryValue);

  if (ceoAlerts) {
    ceoAlerts.innerHTML = `
      <div class="alert alert-success">Revenue: ${formatCurrency(revenue)}</div>
      <div class="alert alert-warning">Low stock alerts: ${lowStock}</div>
      <div class="alert alert-error">Expiring soon: ${expiring}</div>
    `;
  }

  renderProductsTable();
  renderCategoriesList();
  renderSalesList();
  renderUsersList();
}

function renderProductsTable() {
  if (!ceoProductsList) return;

  ceoProductsList.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Qty</th>
          <th>Cost</th>
          <th>Price</th>
          <th>Expiry</th>
        </tr>
      </thead>
      <tbody>
        ${state.products.map(product => `
          <tr>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${product.quantity}</td>
            <td>${formatCurrency(product.cost)}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.expiryDate}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderCategoriesList() {
  if (!ceoCategoriesList) return;

  ceoCategoriesList.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${state.categories.map(category => `
          <tr>
            <td>${category.name}</td>
            <td>${category.description || '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderSalesList() {
  if (!ceoSalesList) return;

  ceoSalesList.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Txn</th>
          <th>Cashier</th>
          <th>Total</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${state.sales.map(sale => `
          <tr>
            <td>${sale.transactionId}</td>
            <td>${sale.cashierName}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${new Date(sale.timestamp).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderUsersList() {
  if (!ceoUsersList) return;

  ceoUsersList.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        ${state.users.map(user => `
          <tr>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

export function attachCeoTabs() {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentTab = button.dataset.tab;
      tabButtons.forEach(item => item.classList.toggle('active', item === button));
      Object.entries(tabPanels).forEach(([key, panel]) => {
        if (panel) panel.style.display = key === currentTab ? 'block' : 'none';
      });
    });
  });
}
