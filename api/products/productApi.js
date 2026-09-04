import api from "../baseUrl";

export const getAllProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getBestSellers = async (params = {}) => {
  const res = await api.get("/products/best-sellers", { params });
  return res.data;
}

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const getProductBySlug = async (slug) => {
  const res = await api.get(`/products/slug/${slug}`);
  return res.data;
};

export const getFeaturedProducts = async () => {
  const res = await api.get("/products/featured");
  return res.data;
};