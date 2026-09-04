import api from "../baseUrl";

export const createContactLeadApi = (payload) => {
  return api.post("/leads/contact", payload);
};

export const createNewsletterLeadApi = (payload) => {
  return api.post("/leads/newsletter", payload);
};