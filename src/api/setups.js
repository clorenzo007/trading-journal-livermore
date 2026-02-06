import { api } from "./api";

export const getSetups = async () => {
  return await api("/setups");
};

export const createSetup = async (data) => {
  const isFormData = data instanceof FormData;
  return await api("/setups", {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  });
};

export const updateSetupsOrder = async (orders) => {
  return await api("/setups/order", {
    method: "PUT",
    body: JSON.stringify({ orders }),
  });
};

export const updateSetup = async (id, data) => {
  return await api(`/setups/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteSetup = async (id) => {
  return await api(`/setups/${id}`, {
    method: "DELETE",
  });
};

export const uploadSetupImage = async (id, field, file) => {
  const form = new FormData();
  form.append("file", file);
  return await api(`/setups/${id}/image/${field}`, {
    method: "POST",
    body: form,
  });
};
