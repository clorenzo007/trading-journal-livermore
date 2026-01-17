const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// =======================
// CRUD
// =======================

export async function getTrades() {
  const res = await fetch(`${API_URL}/trades`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
}

export async function getTradeById(id) {
  const res = await fetch(`${API_URL}/trades/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
}

export async function createTrade(data) {
  const res = await fetch(`${API_URL}/trades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTrade(id, data) {
  const res = await fetch(`${API_URL}/trades/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTrade(tradeId) {
  const res = await fetch(`${API_URL}/trades/${tradeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
}

// =======================
// REVIEW
// =======================

export async function reviewTrade(tradeId, data) {
  const res = await fetch(`${API_URL}/trades/${tradeId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

// =======================
// IMÁGENES
// =======================

export async function uploadEntryImage(tradeId, file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/trades/${tradeId}/entry-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  return res.json();
}

export async function uploadReviewImage(tradeId, file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/trades/${tradeId}/review-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  return res.json();
}

export async function deleteEntryImage(tradeId) {
  const res = await fetch(`${API_URL}/trades/${tradeId}/entry-image`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
}

export async function deleteReviewImage(tradeId) {
  const res = await fetch(`${API_URL}/trades/${tradeId}/review-image`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
}
