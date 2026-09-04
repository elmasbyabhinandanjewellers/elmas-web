"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAllCategories } from "@/api/categories/categoryApi";

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);

      const res = await getAllCategories();

      const finalData =
        res?.data?.categories ||
        res?.data ||
        res?.categories ||
        res ||
        [];

      setCategories(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      setCategoryError(
        error?.response?.data?.message || "Failed to fetch categories"
      );
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getCategoryBySlug = (slug) => {
    return categories.find((category) => category.slug === slug);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        categoryLoading,
        categoryError,
        fetchCategories,
        getCategoryBySlug,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }

  return context;
}