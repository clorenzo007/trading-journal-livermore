import { api } from "../api/api";

// =========================
// GET ACCOUNTS
// =========================
export function getAccounts() {
  return api("/accounts");
}

// =========================
// CREATE ACCOUNT
// =========================
export function createAccount(data) {
  return api("/accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =========================
// 🔥 ACTIVATE ACCOUNT (NUEVO)
// =========================
export function activateAccount(id) {
  return api(`/accounts/${id}/activate`, {
    method: "PUT",
  });
}

// =========================
// UPDATE ACCOUNT
// =========================
export function updateAccount(id, data) {
  return api(`/accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// =========================
// ARCHIVE ACCOUNT
// =========================
export function archiveAccount(id) {
  return api(`/accounts/${id}/archive`, {
    method: "PATCH",
  });
}
