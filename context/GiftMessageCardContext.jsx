"use client";

import { createContext, useContext, useState } from "react";
import { getGiftMessageCardsApi } from "@/api/giftMessageCards/giftMessageCardApi";

const GiftMessageCardContext = createContext(null);

export function GiftMessageCardProvider({ children }) {
  const [giftMessageCards, setGiftMessageCards] = useState([]);
  const [giftMessageCardLoading, setGiftMessageCardLoading] = useState(false);
  const [giftMessageCardError, setGiftMessageCardError] = useState(null);

  const fetchGiftMessageCards = async (params = { status: "active" }) => {
    try {
      setGiftMessageCardLoading(true);
      setGiftMessageCardError(null);

      const res = await getGiftMessageCardsApi(params);

      const finalData =
        res?.data?.data ||
        res?.data?.items ||
        res?.data ||
        [];

      setGiftMessageCards(Array.isArray(finalData) ? finalData : []);
      return Array.isArray(finalData) ? finalData : [];
    } catch (error) {
      setGiftMessageCardError(
        error?.response?.data?.message || "Failed to fetch gift message cards"
      );
      setGiftMessageCards([]);
      return [];
    } finally {
      setGiftMessageCardLoading(false);
    }
  };

  return (
    <GiftMessageCardContext.Provider
      value={{
        giftMessageCards,
        giftMessageCardLoading,
        giftMessageCardError,
        fetchGiftMessageCards,
      }}
    >
      {children}
    </GiftMessageCardContext.Provider>
  );
}

export function useGiftMessageCards() {
  const context = useContext(GiftMessageCardContext);

  if (!context) {
    throw new Error(
      "useGiftMessageCards must be used within GiftMessageCardProvider"
    );
  }

  return context;
}