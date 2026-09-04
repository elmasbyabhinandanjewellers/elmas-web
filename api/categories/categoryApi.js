import api from "../baseUrl";

export const getAllCategories = async () => {
  const res = await api.get("/category");
  return res.data;
};

export const getCategoryById = async (id) => {
  const res = await api.get(`/category/${id}`);
  return res.data;
};

export const getCategoryBySlug = async (slug) => {
  const res = await api.get(`/category/slug/${slug}`);
  return res.data;
};