const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL);

// =======================
// LOGIN
// =======================
// =======================
// LOGIN USER
// Posts email/password to /auth/login.
// Returns token and user profile.
// =======================
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

// =======================
// REGISTER
// =======================
export async function register(email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Register failed");
  }

  return data;
}
