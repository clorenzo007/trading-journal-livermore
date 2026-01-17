const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

export async function deleteTrade(id) {
  const res = await fetch(`${API_URL}/trades/${id}`, {
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

export async function reviewTrade(id, data) {
  const res = await fetch(`${API_URL}/trades/${id}/review`, {
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
// UPLOADS (WITH PROGRESS)
// =======================

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

function uploadWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
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

// =======================
// DELETE IMAGES
// =======================

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
export async function getTradesPaginated(params = {}) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_URL}/trades?${query}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
}
