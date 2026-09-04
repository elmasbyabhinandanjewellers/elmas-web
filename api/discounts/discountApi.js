// api/discounts/discountApi.js
import api from "../baseUrl";

export const getAvailableDiscountsForOrderApi = (payload) => {
  return api.post("/discounts/available-for-order", payload);
};

export const validateDiscountApi = (payload) => {
  return api.post("/discounts/validate", payload);
};

export const getMyAvailableDiscountsApi = () => {
  return api.get("/discounts/my/available");
};