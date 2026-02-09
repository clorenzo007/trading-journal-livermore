import { api } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

// =======================
// HELPERS
// =======================

// =======================
// HELPERS
// =======================

/**
 * Attaches the active account ID to the payload.
 * Useful for create/update operations that need explicit account linkage.
 */
function withAccount(data = {}) {
  const accountId = localStorage.getItem("activeAccountId");
  return { ...data, account: accountId };
}

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
  console.log("TRADE PAYLOAD:", data);
  return api("/trades", {
    method: "POST",
    body: JSON.stringify(withAccount(data)), // 🔥 FIX
  });
}

export function updateTrade(id, data) {
  return api(`/trades/${id}`, {
    method: "PUT",
    body: JSON.stringify(withAccount(data)), // 🔥 FIX
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
    body: JSON.stringify(withAccount(data)), // 🔥 FIX
  });
}

// =======================
// UPLOADS
// =======================

function uploadWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("activeAccountId");

    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    if (accountId) xhr.setRequestHeader("x-account-id", accountId);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch {
        reject(new Error("Invalid server response"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.send(formData);
  });
}

export function uploadEntryImage(tradeId, file, onProgress) {
  return uploadWithProgress(
    `${API_URL}/trades/${tradeId}/entry-image`,
    file,
    onProgress
  );
}

export function uploadReviewImage(tradeId, file, onProgress) {
  return uploadWithProgress(
    `${API_URL}/trades/${tradeId}/review-image`,
    file,
    onProgress
  );
}

// =======================
// DELETE IMAGES
// =======================

export function deleteEntryImage(tradeId) {
  return api(`/trades/${tradeId}/entry-image`, { method: "DELETE" });
}

export function deleteReviewImage(tradeId) {
  return api(`/trades/${tradeId}/review-image`, { method: "DELETE" });
}

// =======================
// PAGINATED
// =======================

export function getTradesPaginated(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api(`/trades?${query}`);
}
