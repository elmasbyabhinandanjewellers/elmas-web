"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  sendWebsiteRegisterOtpApi,
  verifyWebsiteRegisterOtpApi,
  registerCustomerApi,
  loginCustomerApi,
  forgotPasswordApi,
  resetPasswordApi,
  getCustomerByIdApi,
  updateCustomerApi,
  addCustomerAddressApi,
  updateCustomerAddressApi,
  deleteCustomerAddressApi,
  addToWishlistApi,
  removeFromWishlistApi,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  mergeGuestCartApi,
} from "@/api/auth/CustomerApi";

const CustomerContext = createContext(null);

const GUEST_CART_KEY = "elmas_guest_cart";

const getProductId = (item) =>
  item?.product?._id || item?.product || item?.productId;

const getGuestCartFromStorage = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveGuestCartToStorage = (items = []) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const clearGuestCartStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
};

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [customerToken, setCustomerToken] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState(null);
  const [customerAuthReady, setCustomerAuthReady] = useState(false);

  const [guestCart, setGuestCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("elmas_customer_token");
    const storedCustomer = localStorage.getItem("elmas_customer");
    const storedGuestCart = getGuestCartFromStorage();

    setGuestCart(storedGuestCart);

    if (token && storedCustomer) {
      const parsedCustomer = JSON.parse(storedCustomer);

      setCustomerToken(token);
      setCustomer(parsedCustomer);
      setCartCount(parsedCustomer?.cart?.length || 0);
      setWishlistCount(parsedCustomer?.wishlist?.length || 0);
    } else {
      setCartCount(storedGuestCart.length || 0);
    }

    setCustomerAuthReady(true);
  }, []);

  const logoutCustomer = () => {
    setCustomer(null);
    setCustomerToken(null);
    setWishlistCount(0);

    const currentGuestCart = getGuestCartFromStorage();
    setGuestCart(currentGuestCart);
    setCartCount(currentGuestCart.length || 0);

    localStorage.removeItem("elmas_customer");
    localStorage.removeItem("elmas_customer_token");
  };

  const normalizeAuthError = (error, fallback = "Something went wrong") => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.data?.message ||
      error?.message ||
      fallback;

    if (error?.response?.status === 401 && message === "Please login first") {
      logoutCustomer();
    }

    return new Error(message);
  };

  const requireCustomerAuth = () => {
    if (!customer?._id || !customerToken) {
      throw new Error("Please login first");
    }
  };

  const refreshCustomerById = async (customerId) => {
    if (!customerId) return null;

    const res = await getCustomerByIdApi(customerId);
    const customerData = res?.data?.data || res?.data?.customer || res?.data;

    setCustomer(customerData);
    localStorage.setItem("elmas_customer", JSON.stringify(customerData));

    setCartCount(customerData?.cart?.length || 0);
    setWishlistCount(customerData?.wishlist?.length || 0);

    return customerData;
  };

  const mergeGuestCartAfterLogin = async (customerId) => {
    const guestItems = getGuestCartFromStorage();

    if (!customerId || !guestItems.length) return null;

    const payloadItems = guestItems
      .map((item) => ({
        product: getProductId(item),
        productId: getProductId(item),
        quantity: Number(item.quantity || 1),
      }))
      .filter((item) => item.productId);

    if (!payloadItems.length) return null;

    const res = await mergeGuestCartApi(customerId, payloadItems);

    clearGuestCartStorage();
    setGuestCart([]);

    await refreshCustomerById(customerId);

    return res.data;
  };

  const saveCustomerSession = async (customerData, token) => {
    setCustomer(customerData);
    setCustomerToken(token);

    localStorage.setItem("elmas_customer", JSON.stringify(customerData));
    localStorage.setItem("elmas_customer_token", token);

    setCartCount(customerData?.cart?.length || 0);
    setWishlistCount(customerData?.wishlist?.length || 0);

    await mergeGuestCartAfterLogin(customerData?._id);
  };

  const sendWebsiteRegisterOtp = async (payload) => {
    try {
      setCustomerLoading(true);
      setCustomerError(null);

      const res = await sendWebsiteRegisterOtpApi(payload);
      return res.data;
    } catch (error) {
      const finalError = normalizeAuthError(error, "Failed to send OTP");
      setCustomerError(finalError.message);
      throw finalError;
    } finally {
      setCustomerLoading(false);
    }
  };

  const verifyWebsiteRegisterOtp = async (payload) => {
    try {
      setCustomerLoading(true);
      setCustomerError(null);

      const res = await verifyWebsiteRegisterOtpApi(payload);

      const customerData = res?.data?.data?.customer || res?.data?.customer;
      const token = res?.data?.data?.token || res?.data?.token;

      if (customerData && token) {
        await saveCustomerSession(customerData, token);
      }

      return res.data;
    } catch (error) {
      const finalError = normalizeAuthError(error, "OTP verification failed");
      setCustomerError(finalError.message);
      throw finalError;
    } finally {
      setCustomerLoading(false);
    }
  };

  const registerCustomer = async (payload) => {
    try {
      setCustomerLoading(true);
      setCustomerError(null);

      const res = await registerCustomerApi(payload);

      const customerData = res?.data?.data?.customer || res?.data?.customer;
      const token = res?.data?.data?.token || res?.data?.token;

      if (customerData && token) {
        await saveCustomerSession(customerData, token);
      }

      return res.data;
    } catch (error) {
      const finalError = normalizeAuthError(error, "Registration failed");
      setCustomerError(finalError.message);
      throw finalError;
    } finally {
      setCustomerLoading(false);
    }
  };

  const loginCustomer = async (payload) => {
    try {
      setCustomerLoading(true);
      setCustomerError(null);

      const res = await loginCustomerApi(payload);

      const customerData = res?.data?.data?.customer || res?.data?.customer;
      const token = res?.data?.data?.token || res?.data?.token;

      if (customerData && token) {
        await saveCustomerSession(customerData, token);
      }

      return res.data;
    } catch (error) {
      const finalError = normalizeAuthError(error, "Login failed");
      setCustomerError(finalError.message);
      throw finalError;
    } finally {
      setCustomerLoading(false);
    }
  };

  const refreshCustomer = async () => {
    if (!customer?._id || !customerToken) return null;

    try {
      return await refreshCustomerById(customer._id);
    } catch (error) {
      if (error?.response?.status === 401) {
        logoutCustomer();
      }

      console.error("Refresh customer error:", error);
      return null;
    }
  };

  const updateCustomer = async (payload) => {
    try {
      requireCustomerAuth();

      const res = await updateCustomerApi(customer._id, payload);
      const customerData = res?.data?.data || res?.data?.customer || res?.data;

      setCustomer(customerData);
      localStorage.setItem("elmas_customer", JSON.stringify(customerData));

      return customerData;
    } catch (error) {
      throw normalizeAuthError(error, "Failed to update customer");
    }
  };

  const forgotPassword = async (payload) => {
    try {
      setCustomerLoading(true);
      setCustomerError(null);

      const res = await forgotPasswordApi(payload);
      return res.data;
    } catch (error) {
      const finalError = normalizeAuthError(error, "Failed to send OTP");
      setCustomerError(finalError.message);
      throw finalError;
    } finally {
      setCustomerLoading(false);
    }
  };

  const resetPassword = async (payload) => {
    try {
      setCustomerLoading(true);
      setCustomerError(null);

      const res = await resetPasswordApi(payload);
      return res.data;
    } catch (error) {
      const finalError = normalizeAuthError(error, "Failed to reset password");
      setCustomerError(finalError.message);
      throw finalError;
    } finally {
      setCustomerLoading(false);
    }
  };

  const addAddress = async (payload) => {
    try {
      requireCustomerAuth();

      const res = await addCustomerAddressApi(customer._id, payload);
      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const updateAddress = async (addressId, payload) => {
    try {
      requireCustomerAuth();

      const res = await updateCustomerAddressApi(
        customer._id,
        addressId,
        payload,
      );
      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      requireCustomerAuth();

      const res = await deleteCustomerAddressApi(customer._id, addressId);
      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      requireCustomerAuth();

      const res = await addToWishlistApi(customer._id, productId);
      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      requireCustomerAuth();

      const res = await removeFromWishlistApi(customer._id, productId);
      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const addToCart = async (payload) => {
    try {
      const productId = payload.productId || payload.product;
      const quantity = Number(payload.quantity || 1);

      if (!productId) {
        throw new Error("Product id is required");
      }

      if (!customer?._id || !customerToken) {
        const current = getGuestCartFromStorage();

        const existing = current.find(
          (item) => String(getProductId(item)) === String(productId),
        );

        let updated;

        if (existing) {
          updated = current.map((item) =>
            String(getProductId(item)) === String(productId)
              ? {
                  ...item,
                  quantity: Number(item.quantity || 0) + quantity,
                  productSnapshot:
                    item.productSnapshot || payload.productSnapshot || null,
                }
              : item,
          );
        } else {
          updated = [
            ...current,
            {
              product: productId,
              productId,
              quantity,
              productSnapshot: payload.productSnapshot || null,
            },
          ];
        }

        saveGuestCartToStorage(updated);
        setGuestCart(updated);
        setCartCount(updated.length);

        return { success: true, data: updated };
      }

      const res = await addToCartApi(customer._id, {
        productId,
        quantity,
      });

      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const updateCartItem = async (productId, payload) => {
    try {
      if (!customer?._id || !customerToken) {
        const finalQuantity = Number(payload.quantity || 1);

        const updated = getGuestCartFromStorage().map((item) =>
          String(getProductId(item)) === String(productId)
            ? { ...item, quantity: finalQuantity }
            : item,
        );

        saveGuestCartToStorage(updated);
        setGuestCart(updated);
        setCartCount(updated.length);

        return { success: true, data: updated };
      }

      const res = await updateCartItemApi(customer._id, productId, payload);
      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (!customer?._id || !customerToken) {
        const updated = getGuestCartFromStorage().filter(
          (item) => String(getProductId(item)) !== String(productId),
        );

        saveGuestCartToStorage(updated);
        setGuestCart(updated);
        setCartCount(updated.length);

        return { success: true, data: updated };
      }

      const res = await removeFromCartApi(customer._id, productId);
      await refreshCustomer();

      return res.data;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  };

  const clearGuestCart = () => {
    clearGuestCartStorage();
    setGuestCart([]);
    if (!customerToken) setCartCount(0);
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        customerToken,
        customerLoading,
        customerError,
        customerAuthReady,

        guestCart,
        cartCount,
        wishlistCount,

        sendWebsiteRegisterOtp,
        verifyWebsiteRegisterOtp,

        registerCustomer,
        loginCustomer,
        logoutCustomer,
        refreshCustomer,
        updateCustomer,

        forgotPassword,
        resetPassword,

        addAddress,
        updateAddress,
        deleteAddress,

        addToWishlist,
        removeFromWishlist,

        addToCart,
        updateCartItem,
        removeFromCart,

        mergeGuestCartAfterLogin,
        clearGuestCart,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomer must be used within CustomerProvider");
  }

  return context;
}