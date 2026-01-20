import { api } from "./api";

// =======================
// CRUD
// =======================

export function getTrades() {
  return api("/trades");
}

export function getTradeById(id) {
  return api(`/trades/${id}`);
}

export function createTrade(data) {
  return api("/trades", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTrade(id, data) {
  return api(`/trades/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteTrade(id) {
  return api(`/trades/${id}`, {
    method: "DELETE",
  });
}

// =======================
// REVIEW
// =======================

export function reviewTrade(id, data) {
  return api(`/trades/${id}/review`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =======================
// PAGINATED
// =======================

export function getTradesPaginated(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api(`/trades?${query}`);
}
