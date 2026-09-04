"use client";

import { createContext, useContext, useState } from "react";
import {
  getAvailableDiscountsForOrderApi,
  getMyAvailableDiscountsApi,
  validateDiscountApi,
} from "@/api/discounts/discountApi";

const DiscountContext = createContext(null);

export function DiscountProvider({ children }) {
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState(null);

  const fetchAvailableDiscountsForOrder = async (payload) => {
    try {
      setDiscountLoading(true);
      setDiscountError(null);

      const res = await getAvailableDiscountsForOrderApi(payload);

      const finalData =
        res?.data?.data ||
        res?.data?.discounts ||
        res?.data ||
        [];

      setAvailableDiscounts(Array.isArray(finalData) ? finalData : []);
      return Array.isArray(finalData) ? finalData : [];
    } catch (error) {
      setDiscountError(
        error?.response?.data?.message || "Failed to fetch discounts"
      );
      setAvailableDiscounts([]);
      return [];
    } finally {
      setDiscountLoading(false);
    }
  };

  const fetchMyAvailableDiscounts = async () => {
    try {
      setDiscountLoading(true);
      setDiscountError(null);

      const res = await getMyAvailableDiscountsApi();

      const finalData =
        res?.data?.data ||
        res?.data?.discounts ||
        res?.data ||
        [];

      setAvailableDiscounts(Array.isArray(finalData) ? finalData : []);
      return Array.isArray(finalData) ? finalData : [];
    } catch (error) {
      setDiscountError(
        error?.response?.data?.message || "Failed to fetch discounts"
      );
      setAvailableDiscounts([]);
      return [];
    } finally {
      setDiscountLoading(false);
    }
  };

  const validateDiscount = async (payload) => {
    const res = await validateDiscountApi(payload);
    return res?.data?.data || res?.data;
  };

  return (
    <DiscountContext.Provider
      value={{
        availableDiscounts,
        discountLoading,
        discountError,
        fetchAvailableDiscountsForOrder,
        fetchMyAvailableDiscounts,
        validateDiscount,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscounts() {
  const context = useContext(DiscountContext);

  if (!context) {
    throw new Error("useDiscounts must be used within DiscountProvider");
  }

  return context;
}