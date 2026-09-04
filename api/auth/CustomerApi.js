import api from "../baseUrl";

// WEBSITE REGISTER WITH OTP
export const sendWebsiteRegisterOtpApi = (payload) => {
  return api.post("/customers/website/register/send-otp", payload);
};

export const verifyWebsiteRegisterOtpApi = (payload) => {
  return api.post("/customers/website/register/verify-otp", payload);
};

// AUTH
export const registerCustomerApi = (payload) => {
  return api.post("/customers/register", payload);
};

export const loginCustomerApi = (payload) => {
  return api.post("/customers/login", payload);
};

export const forgotPasswordApi = (payload) => {
  return api.post("/customers/forgot-password", payload);
};

export const resetPasswordApi = (payload) => {
  return api.post("/customers/reset-password", payload);
};

// CUSTOMER PROFILE
export const getCustomerByIdApi = (customerId) => {
  return api.get(`/customers/${customerId}`);
};

export const updateCustomerApi = (customerId, payload) => {
  return api.put(`/customers/${customerId}`, payload);
};

// ADDRESSES
export const addCustomerAddressApi = (customerId, payload) => {
  return api.post(`/customers/${customerId}/addresses`, payload);
};

export const updateCustomerAddressApi = (customerId, addressId, payload) => {
  return api.put(`/customers/${customerId}/addresses/${addressId}`, payload);
};

export const deleteCustomerAddressApi = (customerId, addressId) => {
  return api.delete(`/customers/${customerId}/addresses/${addressId}`);
};

// WISHLIST
export const addToWishlistApi = (customerId, productId) => {
  return api.post(`/customers/${customerId}/wishlist`, { productId });
};

export const removeFromWishlistApi = (customerId, productId) => {
  return api.delete(`/customers/${customerId}/wishlist/${productId}`);
};

// CART
export const addToCartApi = (customerId, payload) => {
  return api.post(`/customers/${customerId}/cart`, payload);
};

export const updateCartItemApi = (customerId, productId, payload) => {
  return api.put(`/customers/${customerId}/cart/${productId}`, payload);
};

export const removeFromCartApi = (customerId, productId) => {
  return api.delete(`/customers/${customerId}/cart/${productId}`);
};

// GUEST CART MERGE
export const mergeGuestCartApi = (customerId, items) => {
  return api.post(`/customers/${customerId}/cart/merge`, { items });
};