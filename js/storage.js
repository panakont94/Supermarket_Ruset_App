const STORAGE_KEY = 'supermarket-ruset-state';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function saveState(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
