export function validateRequired(value, label) {
  if (!String(value || '').trim()) {
    return `${label} is required.`;
  }
  return '';
}

export function validatePositiveNumber(value, label) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return `${label} must be a positive number.`;
  }
  return '';
}

export function validateExpiryDate(value) {
  if (!value) {
    return 'Expiry date is required.';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Expiry date is invalid.';
  }

  return '';
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(Number(value || 0));
}
