"use client";

import { createContext, useContext, useState } from "react";
import {
  createOrderApi,
  verifyOrderPaymentApi,
  createWebsiteCheckoutApi,
  verifyWebsiteCheckoutPaymentApi,
  getOrderByIdApi,
  downloadOrderInvoicePdfApi,
} from "@/api/orders/orderApi";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const normalizeResponse = (res) => {
    const data = res?.data?.data || res?.data || res;

    if (data?.order) return data.order;
    return data;
  };

  const normalizeCheckoutResponse = (res) => {
    return res?.data?.data || res?.data || res;
  };

  const getErrorMessage = (error, fallback) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    );
  };

  const createOrder = async (payload) => {
    try {
      setOrderLoading(true);
      setOrderError(null);

      const res = await createOrderApi(payload);
      const data = normalizeResponse(res);

      setCurrentOrder(data);
      return data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to create order");
      setOrderError(message);
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const verifyOrderPayment = async (payload) => {
    try {
      setOrderLoading(true);
      setOrderError(null);

      const res = await verifyOrderPaymentApi(payload);
      const data = normalizeResponse(res);

      setCurrentOrder(data);
      return data;
    } catch (error) {
      const message = getErrorMessage(error, "Payment verification failed");
      setOrderError(message);
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const createWebsiteCheckout = async (payload) => {
    try {
      setOrderLoading(true);
      setOrderError(null);

      const res = await createWebsiteCheckoutApi(payload);
      return normalizeCheckoutResponse(res);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to create website checkout",
      );
      setOrderError(message);
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const verifyWebsiteCheckoutPayment = async (payload) => {
    try {
      setOrderLoading(true);
      setOrderError(null);

      const res = await verifyWebsiteCheckoutPaymentApi(payload);
      const data = normalizeResponse(res);

      setCurrentOrder(data);
      return data;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Website payment verification failed",
      );
      setOrderError(message);
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      setOrderLoading(true);
      setOrderError(null);

      const res = await getOrderByIdApi(orderId);
      const data = normalizeResponse(res);

      setCurrentOrder(data);
      return data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch order");
      setOrderError(message);
      setCurrentOrder(null);
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const downloadOrderInvoicePdf = async (orderId) => {
    try {
      setOrderLoading(true);
      setOrderError(null);

      const res = await downloadOrderInvoicePdfApi(orderId);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
      }, 10000);

      return true;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to download invoice");
      setOrderError(message);
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
    setOrderError(null);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orderLoading,
        orderError,

        createOrder,
        verifyOrderPayment,

        createWebsiteCheckout,
        verifyWebsiteCheckoutPayment,

        getOrderById,
        downloadOrderInvoicePdf,

        clearCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }

  return context;
}