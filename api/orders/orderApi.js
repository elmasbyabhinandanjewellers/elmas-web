import api from "../baseUrl";

export const createOrderApi = (payload) => {
  return api.post("/orders", payload);
};

export const verifyOrderPaymentApi = (payload) => {
  return api.post("/orders/verify-payment", payload);
};

export const createWebsiteCheckoutApi = (payload) => {
  return api.post("/orders/website/checkout", payload);
};

export const verifyWebsiteCheckoutPaymentApi = (payload) => {
  return api.post("/orders/website/verify-payment", payload);
};

export const getOrderByIdApi = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const downloadOrderInvoicePdfApi = (orderId) => {
  return api.get(`/orders/${orderId}/invoice`, {
    responseType: "blob",
  });
};