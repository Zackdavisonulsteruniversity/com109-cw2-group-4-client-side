function getLocalStorageValue(key) {
  return localStorage.getItem(key);
}

function setLocalStorageValue(key, value) {
  localStorage.setItem(key, value);
}

function removeLocalStorageValue(key) {
  localStorage.removeItem(key);
}

function clearLocalStorage() {
  localStorage.clear();
}

export function doesLocalStorageKeyExist(key) {
  try {
    localStorage.getItem(key);
    return true;
  } catch (e) {
    return false;
  }
}
