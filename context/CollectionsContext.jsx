"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAllCollections } from "@/api/collections/collectionApi";

const CollectionsContext = createContext(null);

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState([]);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [collectionError, setCollectionError] = useState(null);

  const fetchCollections = async () => {
    try {
      setCollectionLoading(true);
      setCollectionError(null);

      const res = await getAllCollections();

      const finalData =
        res?.data?.collections ||
        res?.data ||
        res?.collections ||
        res ||
        [];

      setCollections(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      setCollectionError(
        error?.response?.data?.message || "Failed to fetch collections"
      );
      setCollections([]);
    } finally {
      setCollectionLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const getCollectionBySlug = (slug) => {
    return collections.find((collection) => collection.slug === slug);
  };

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        setCollections,
        collectionLoading,
        collectionError,
        fetchCollections,
        getCollectionBySlug,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw new Error("useCollections must be used within CollectionsProvider");
  }

  return context;
}