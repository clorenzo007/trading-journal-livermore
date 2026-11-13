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
    const err = new Error(data.error || "Login failed");
    if (data.needsVerification) {
      err.needsVerification = true;
      err.email = data.email;
    }
    throw err;
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

// =======================
// VERIFY EMAIL
// =======================
export async function verifyEmail(email, code) {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Verification failed");
  }

  return data;
}

// =======================
// RESEND VERIFICATION CODE
// =======================
export async function resendCode(email) {
  const res = await fetch(`${API_URL}/auth/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Could not resend code");
  }

  return data;
}
