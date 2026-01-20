import { api } from "../api/api";

export function getAccounts() {
  return api("/accounts");
}

export function createAccount(data) {
  return api("/accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAccount(id, data) {
  return api(`/accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function archiveAccount(id) {
  return api(`/accounts/${id}/archive`, {
    method: "PATCH",
  });
}
