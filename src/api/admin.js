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
