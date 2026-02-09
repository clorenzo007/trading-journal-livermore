import api from "./axios";

// ==========================
// STRATEGIES
// ==========================
export const getStrategies = async () => {
  const res = await api.get("/admin/strategies");
  return res.data;
};

export const createStrategy = async (data) => {
  const res = await api.post("/admin/strategies", data);
  return res.data;
};

export const deleteStrategy = async (id) => {
  const res = await api.delete(`/admin/strategies/${id}`);
  return res.data;
};

// ==========================
// PATTERNS
// ==========================
export const getPatterns = async () => {
  const res = await api.get("/admin/patterns");
  return res.data;
};

export const createPattern = async (data) => {
  const res = await api.post("/admin/patterns", data);
  return res.data;
};

export const deletePattern = async (id) => {
  const res = await api.delete(`/admin/patterns/${id}`);
  return res.data;
};
