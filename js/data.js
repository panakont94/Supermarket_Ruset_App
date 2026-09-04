export const users = [
  { id: 'u-1', username: 'ceo', password: 'ceo123', role: 'ceo', name: 'Alexander Ruset' },
  { id: 'u-2', username: 'cashier1', password: 'cash123', role: 'cashier', name: 'Maria Santos' },
  { id: 'u-3', username: 'warehouse1', password: 'wh123', role: 'warehouse', name: 'Nikos Pappas' }
];

export const categories = [
  { id: 'cat-1', name: 'Fresh Produce', description: 'Fresh fruits and vegetables' },
  { id: 'cat-2', name: 'Bakery', description: 'Bread, pastries, and bakery items' },
  { id: 'cat-3', name: 'Beverages', description: 'Soft drinks, water, and juices' },
  { id: 'cat-4', name: 'Dairy', description: 'Milk, yogurt, cheese and dairy products' },
  { id: 'cat-5', name: 'Pantry', description: 'Canned, dry, and shelf-stable groceries' }
];

export const products = [
  {
    id: 'p-1', sku: 'SKU-001', name: 'Bananas', categoryId: 'cat-1', price: 1.5, cost: 0.9,
    quantity: 42, unit: 'bunch', expiryDate: '2026-09-25', minStock: 10, createdAt: '2026-09-01'
  },
  {
    id: 'p-2', sku: 'SKU-002', name: 'Milk 1L', categoryId: 'cat-4', price: 2.2, cost: 1.4,
    quantity: 18, unit: 'bottle', expiryDate: '2026-09-15', minStock: 8, createdAt: '2026-09-01'
  },
  {
    id: 'p-3', sku: 'SKU-003', name: 'Bread Loaf', categoryId: 'cat-2', price: 2.8, cost: 1.7,
    quantity: 25, unit: 'loaf', expiryDate: '2026-09-12', minStock: 10, createdAt: '2026-09-01'
  },
  {
    id: 'p-4', sku: 'SKU-004', name: 'Sparkling Water', categoryId: 'cat-3', price: 1.8, cost: 0.8,
    quantity: 31, unit: 'bottle', expiryDate: '2027-02-01', minStock: 12, createdAt: '2026-09-01'
  },
  {
    id: 'p-5', sku: 'SKU-005', name: 'Rice 5kg', categoryId: 'cat-5', price: 7.5, cost: 5.2,
    quantity: 14, unit: 'bag', expiryDate: '2027-05-10', minStock: 5, createdAt: '2026-09-01'
  },
  {
    id: 'p-6', sku: 'SKU-006', name: 'Tomatoes', categoryId: 'cat-1', price: 2.4, cost: 1.3,
    quantity: 8, unit: 'kg', expiryDate: '2026-09-10', minStock: 6, createdAt: '2026-09-01'
  }
];

export const sales = [
  {
    id: 's-1',
    transactionId: 'TXN-1001',
    cashierId: 'u-2',
    cashierName: 'Maria Santos',
    items: [
      { productId: 'p-1', name: 'Bananas', qty: 2, price: 1.5, subtotal: 3.0 },
      { productId: 'p-2', name: 'Milk 1L', qty: 1, price: 2.2, subtotal: 2.2 }
    ],
    total: 5.2,
    paymentMethod: 'Cash',
    timestamp: '2026-09-02T10:30:00'
  }
];

export const seedData = {
  users,
  categories,
  products,
  sales
};
