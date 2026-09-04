import { state, getProductById, persistState, getStatusBadge } from './state.js';
import { formatCurrency, validateExpiryDate, validatePositiveNumber } from './validation.js';

const warehouseTableBody = document.getElementById('warehouseTableBody');
const warehouseAlerts = document.getElementById('warehouseAlerts');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const productModalTitle = document.getElementById('productModalTitle');

let currentProductId = null;

function setWarehouseAlert(message, type = 'success') {
  if (!warehouseAlerts) return;
  warehouseAlerts.textContent = message;
  warehouseAlerts.style.display = 'block';
  warehouseAlerts.className = `alert alert-${type}`;
}

export function renderWarehouseTable() {
  if (!warehouseTableBody) return;

  if (!state.products.length) {
    warehouseTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">No products available.</td></tr>';
    return;
  }

  warehouseTableBody.innerHTML = state.products.map(product => {
    const status = getStatusBadge(product);
    const badgeClass = status === 'Low Stock' ? 'status-low-stock' : status === 'Expired' ? 'status-expired' : status === 'Expiring Soon' ? 'status-expiring' : 'status-in-stock';

    return `
      <tr>
        <td>${product.sku}</td>
        <td>${product.name}</td>
        <td>${state.categories.find(cat => cat.id === product.categoryId)?.name || 'Uncategorized'}</td>
        <td>${product.quantity}</td>
        <td>${formatCurrency(product.cost)}</td>
        <td>${formatCurrency(product.price)}</td>
        <td>${product.expiryDate}</td>
        <td><span class="status-badge ${badgeClass}">${status}</span></td>
        <td>
          <div class="btn-row">
            <button class="btn btn-primary" data-edit-product="${product.id}" type="button">Edit</button>
            <button class="btn btn-danger" data-delete-product="${product.id}" type="button">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const lowStockCount = state.products.filter(product => product.quantity <= product.minStock).length;
  if (lowStockCount > 0) {
    setWarehouseAlert(`${lowStockCount} product(s) need attention in the warehouse.`, 'warning');
  } else {
    setWarehouseAlert('Warehouse status looks healthy.', 'success');
  }
}

export function openProductModal(productId = null) {
  currentProductId = productId;
  productModalTitle.textContent = productId ? 'Edit Product' : 'Add Product';

  const product = productId ? getProductById(productId) : null;
  const categorySelect = document.getElementById('productCategory');
  categorySelect.innerHTML = state.categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('');

  if (product) {
    document.getElementById('productSku').value = product.sku;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.categoryId;
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productCost').value = product.cost;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productExpiry').value = product.expiryDate;
    document.getElementById('productMinStock').value = product.minStock;
  } else {
    productForm.reset();
    if (state.categories[0]) {
      document.getElementById('productCategory').value = state.categories[0].id;
    }
  }

  productModal.classList.add('active');
}

export function closeProductModal() {
  productModal.classList.remove('active');
  productForm.reset();
  currentProductId = null;
}

export function attachWarehouseEvents() {
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => openProductModal());
  }

  document.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-product]');
    if (editButton) {
      openProductModal(editButton.dataset.editProduct);
    }

    const deleteButton = event.target.closest('[data-delete-product]');
    if (deleteButton) {
      const productId = deleteButton.dataset.deleteProduct;
      const product = getProductById(productId);
      if (!product) return;
      const confirmDelete = window.confirm(`Delete ${product.name}?`);
      if (confirmDelete) {
        state.products = state.products.filter(item => item.id !== productId);
        persistState();
        renderWarehouseTable();
      }
    }
  });

  if (productForm) {
    productForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = {
        sku: document.getElementById('productSku').value.trim(),
        name: document.getElementById('productName').value.trim(),
        categoryId: document.getElementById('productCategory').value,
        quantity: Number(document.getElementById('productQuantity').value),
        cost: Number(document.getElementById('productCost').value),
        price: Number(document.getElementById('productPrice').value),
        expiryDate: document.getElementById('productExpiry').value,
        minStock: Number(document.getElementById('productMinStock').value)
      };

      if (!formData.sku || !formData.name) {
        setWarehouseAlert('Product name and SKU are required.', 'error');
        return;
      }

      if (validatePositiveNumber(formData.quantity, 'Quantity')) {
        setWarehouseAlert('Quantity must be a positive number.', 'error');
        return;
      }

      const expiryError = validateExpiryDate(formData.expiryDate);
      if (expiryError) {
        setWarehouseAlert(expiryError, 'error');
        return;
      }

      const product = currentProductId ? getProductById(currentProductId) : null;
      if (product) {
        Object.assign(product, formData);
        product.updatedAt = new Date().toISOString();
      } else {
        state.products.push({
          id: `p-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      persistState();
      closeProductModal();
      renderWarehouseTable();
      setWarehouseAlert(currentProductId ? 'Product updated successfully.' : 'Product created successfully.', 'success');
    });
  }
}
