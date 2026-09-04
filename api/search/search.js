import axios from "axios";
import api  from "../baseUrl";

const getSlug = (item) => item?.checkName || item?.slug || item?._id || item?.id;

const getImage = (item) => {
  if (Array.isArray(item?.images) && item.images.length > 0) {
    const first = item.images[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;
    if (first?.secure_url) return first.secure_url;
    if (first?.src) return first.src;
  }
  if (item?.image) return item.image;
  return null;
};

export const fetchSearchSuggestions = async (query) => {
  const q = query?.trim();

  if (!q || q.length < 2) {
    return [];
  }

  const { data } = await api.get(`search/suggestions?q=${encodeURIComponent(q)}`);

  // Temporary: log raw response to help identify field names

  // Handle both { data: { products, categories, collections } } and { products, categories, collections }
  const result = (data?.data && typeof data.data === "object" && !Array.isArray(data.data))
    ? data.data
    : data || {};

  const products = (result.products || []).map((item) => {
    const slug = getSlug(item);
    return {
      ...item,
      type: item.type || "product",
      title: item.name || item.title,
      subtitle: item.categories?.[0]?.name || item.collections?.[0]?.name || item.subtitle || "Product",
      image: getImage(item),
      href: item?.href,
    };
  });

  const categories = (result.categories || []).map((item) => {
    const slug = getSlug(item);
    return {
      ...item,
      type: item.type || "category",
      title: item.name || item.title,
      subtitle: item.description || item.subtitle || "Category",
      image: getImage(item),
      href: item?.href,
    };
  });

  const collections = (result.collections || []).map((item) => {
    
    const slug = getSlug(item);
    return {
      ...item,
      type: item.type || "collection",
      title: item.name || item.title,
      subtitle: item.description || item.subtitle || "Collection",
      image: getImage(item),
      href: item?.href,
    };
  });

  return [...products, ...categories, ...collections];
};