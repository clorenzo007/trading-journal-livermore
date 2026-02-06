import { api } from "./api";

export const getConcepts = async () => {
  return await api("/concepts");
};

export const createConcept = async (data) => {
  return await api("/concepts", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateConcept = async (id, data) => {
  return await api(`/concepts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteConcept = async (id) => {
  return await api(`/concepts/${id}`, {
    method: "DELETE",
  });
};

export const uploadConceptImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await api(`/concepts/${id}/image`, {
    method: "POST",
    body: formData,
  });
};
