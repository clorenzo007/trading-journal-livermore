import { api } from "./api";

// ==========================
// STRATEGIES
// ==========================
export function getStrategies() {
  return api("/admin/strategies");
}

export function createStrategy(data) {
  return api("/admin/strategies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteStrategy(id) {
  return api(`/admin/strategies/${id}`, {
    method: "DELETE",
  });
}

export function updateStrategy(id, title) {
  return api(`/admin/strategies/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });
}

// ==========================
// PATTERNS
// ==========================
export function getPatterns() {
  return api("/admin/patterns");
}

export function createPattern(data) {
  return api("/admin/patterns", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deletePattern(id) {
  return api(`/admin/patterns/${id}`, {
    method: "DELETE",
  });
}

export function updatePattern(id, title) {
  return api(`/admin/patterns/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });
}

// ==========================
// LIST ITEMS (Generic)
// ==========================
export function getListItems(type) {
  // type: 'emotional_pre', 'emotional_post', 'reason_entry', 'reason_exit'
  return api(`/admin/list-items/${type}`);
}

export function createListItem(data) {
  // data: { type, value }
  return api("/admin/list-items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteListItem(id) {
  return api(`/admin/list-items/${id}`, {
    method: "DELETE",
  });
}

export function updateListItem(id, value) {
  return api(`/admin/list-items/${id}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });
}

// ==========================
// USERS MANAGEMENT
// ==========================
export function getUsers() {
  return api("/admin/users");
}

export function toggleUserStatus(id) {
  return api(`/admin/users/${id}/toggle`, {
    method: "PATCH",
  });
}

export function updateUserRole(id, role) {
  return api(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function updateUserPassword(id, password) {
  return api(`/admin/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });
}

export function deleteUser(id) {
  return api(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
