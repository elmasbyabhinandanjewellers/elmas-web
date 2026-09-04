import api from "../baseUrl";

export const getAllCollections = async () => {
  const res = await api.get("/collections");
  return res.data;
};

export const getCollectionById = async (id) => {
  const res = await api.get(`/collections/${id}`);
  return res.data;
};

export const getCollectionBySlug = async (slug) => {
  const res = await api.get(`/collections/slug/${slug}`);
  return res.data;
};