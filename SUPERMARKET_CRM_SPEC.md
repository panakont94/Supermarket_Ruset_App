# Supermarket Ruset CRM System - Specification & Manual

## Project Overview
**Supermarket Ruset CRM System** is a pure, local vanilla JavaScript web application designed to manage retail supermarket operations without external dependencies or backend requirements. It provides role-based access control for **Cash Register (POS)**, **Warehouse Inventory**, and **CEO Management**, backed by browser `localStorage` persistence.

---

## Roles & Permissions Matrix

| Feature / Screen | CEO | Cash Register (POS) | Warehouse |
| :--- | :---: | :---: | :---: |
| **Portal Login Page** | Yes | Yes | Yes |
| **Cash Register (POS) Screen** | Yes | Yes | No |
| **Cashier Sales History** | Yes | Yes | No |
| **Warehouse Inventory Management** | Yes | No | Yes |
| **Stock & Expiry Alerts** | Yes | No | Yes |
| **CEO Executive Dashboard** | Yes | No | No |
| **Master Product CRUD** | Yes | No | Yes |
| **Category Management** | Yes | No | No |
| **System User Directory** | Yes | No | No |
| **Master Sales Reports** | Yes | No | No |

---

## Default Access Credentials (Stored in `js/data.js`)

| Role | Username | Password | Full Name | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **CEO** | `ceo` | `ceo123` | Alexander Ruset (CEO) | Master Administrator (All Screens) |
| **Cash Register** | `cashier1` | `cash123` | Maria Santos (Cashier) | Point of Sale & Personal Sales Log |
| **Warehouse** | `warehouse1` | `wh123` | Nikos Pappas (Warehouse Manager) | Inventory, Quantities, Prices & Expiration |

---

## Key Modules & System Architecture

### 1. Portal Login Page
- Branded header displaying "Supermarket Ruset" logo badge, slogan, and login card.
- Username and password inputs with field validation and interactive quick-demo login buttons.
- Session persistence via `sessionStorage` (auto-login restored on refresh).

### 2. Cash Register (POS) Module (`js/cashier.js`)
- Real-time product search by SKU, name, or category filter.
- Dynamic shopping cart with quantity increment/decrement, item deletion, and running total.
- Payment processing modal (Cash or Card with change calculation).
- Stock validation: prevents selling out-of-stock or expired products.
- Automated inventory deduction upon checkout and instant digital receipt modal.

### 3. Warehouse Module (`js/warehouse.js`)
- Comprehensive product stock table showing SKU, Name, Category, Quantity, Cost Price, Selling Price, Expiry Date, and Status Badges.
- Quick inline stock adjustments and price updates.
- Automated badge indicators:
  - **In Stock** (Green)
  - **Low Stock** (Yellow - Quantity <= 10)
  - **Out of Stock** (Red - Quantity = 0)
  - **Expiring Soon** (Orange - Expiry within 30 days)
  - **Expired** (Dark Red - Past expiry date)
- Full product addition and editing modal.

### 4. CEO Executive Dashboard (`js/ceo.js`)
- KPI Summary Cards: Total Sales Revenue, Total Inventory Value, Low Stock Count, Expiring Products Count.
- Tabbed Master Console:
  - **Overview**: Real-time sales metrics & alert banners.
  - **Product Control**: Full product creation, edit, price adjustments, and deletion.
  - **Categories**: Create and manage product categories (Dairy, Bakery, Beverages, Fresh Produce, Pantry).
  - **Sales Audit**: Full audit log of all completed sales transactions across all cashiers.
  - **User Directory**: List of system users and permissions.

---

## File Structure

```
Supermarket_Ruset_App/
├── SUPERMARKET_CRM_SPEC.md   # System specification & user manual
├── README.md                 # Project summary and quick start guide
├── index.html                # Single-page application shell
├── styles/
│   ├── theme.css             # Color tokens, typography, design variables
│   ├── layout.css            # Responsive grids, flex structures, navbar, sidebar
│   └── components.css        # Buttons, cards, tables, modals, status badges
└── js/
    ├── data.js               # Initial seed data (users, categories, products, sales)
    ├── storage.js            # localStorage persistence adapter
    ├── state.js              # Central reactive state manager
    ├── auth.js               # Authentication, credentials verification, session guard
    ├── validation.js         # Input sanitization and form validation
    ├── router.js             # Role-aware screen navigator
    ├── cashier.js            # Point of Sale & checkout logic
    ├── warehouse.js          # Inventory, stock level, price & expiry tracking
    ├── ceo.js                # Executive dashboard & master control
    └── app.js                # App bootstrap and event delegates
```

---

## How to Run
1. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari) or use VS Code Live Server.
2. Use the quick-fill login buttons on the portal login page to switch between **CEO**, **Cashier**, and **Warehouse** roles.
3. Any changes made to inventory, prices, or sales are saved locally in the browser's `localStorage`. Click "Reset Demo Data" in the user menu to restore default seed data if needed.
