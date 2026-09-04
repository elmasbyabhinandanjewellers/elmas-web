"use client";

import { createContext, useContext, useState } from "react";
import { getAllProducts, getBestSellers } from "@/api/products/productApi";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(false);
  const [bestSellersError, setBestSellersError] = useState(null);

  const fetchProducts = async (params = {}) => {
    try {
      setProductLoading(true);
      setProductError(null);

      const res = await getAllProducts(params);
      const finalData =
        res?.data?.products || res?.data || res?.products || res || [];

      setProducts(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      setProductError(
        error?.response?.data?.message || "Failed to fetch products",
      );
      setProducts([]);
    } finally {
      setProductLoading(false);
    }
  };



  const fetchBestSellers = async (query = {}) => {
    try {
      setBestSellersLoading(true);

      const res = await getBestSellers(query);
      return res;
    } catch (error) {
      console.error("Fetch best sellers error:", error);
      return null;
    } finally {
      setBestSellersLoading(false);
    }
  };

  const getProductBySlug = (slug) => {
    return products.find(
      (product) =>
        product.slug === slug ||
        product.checkName === slug ||
        product._id === slug,
    );
  };

  const getProductsByCategory = (categorySlugOrId) => {
    return products.filter((product) => {
      const category = product.category || product.categories;

      if (Array.isArray(category)) {
        return category.some(
          (item) =>
            item === categorySlugOrId ||
            item?._id === categorySlugOrId ||
            item?.slug === categorySlugOrId,
        );
      }

      return (
        category === categorySlugOrId ||
        category?._id === categorySlugOrId ||
        category?.slug === categorySlugOrId
      );
    });
  };

  const getProductsByCollection = (collectionSlugOrId) => {
    return products.filter((product) => {
      const collection = product.collection || product.collections;

      if (Array.isArray(collection)) {
        return collection.some(
          (item) =>
            item === collectionSlugOrId ||
            item?._id === collectionSlugOrId ||
            item?.slug === collectionSlugOrId,
        );
      }

      return (
        collection === collectionSlugOrId ||
        collection?._id === collectionSlugOrId ||
        collection?.slug === collectionSlugOrId
      );
    });
  };

  const getFeaturedProducts = () => {
    return products.filter((product) => product.featured || product.isFeatured);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        productLoading,
        productError,
        fetchProducts,
        getProductBySlug,
        getProductsByCategory,
        getProductsByCollection,
        getFeaturedProducts,

        bestSellers,
        bestSellersLoading,
        bestSellersError,
        fetchBestSellers,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }

  return context;
}
