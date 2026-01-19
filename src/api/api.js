const API = import.meta.env.VITE_API_URL;

if (!API) {
  throw new Error("VITE_API_URL no está definida");
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const url = `${API.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.error("Respuesta no JSON:", text);
    throw new Error("Respuesta inválida del servidor");
  }

  if (!res.ok) {
    throw new Error(data?.error || "API error");
  }

  return data;
}
