import api from "../baseUrl";

export const getGiftMessageCardsApi = (params = {}) => {
  return api.get("/gift-message-cards", { params });
};

export const getGiftMessageCardByIdApi = (id) => {
  return api.get(`/gift-message-cards/${id}`);
};