export const getSlug = (item) => item?.checkName || item?.slug || item?._id;

export const getItemImage = (item) => {
  if (!item) return null;

  if (Array.isArray(item.images)) {
    const first = item.images[0];

    if (typeof first === "string") return first;
    if (first?.url) return first.url;
    if (first?.secure_url) return first.secure_url;
    if (first?.src) return first.src;
  }

  return null;
};

export const getNavbarImagesForItems = ({ items = [], limit = 3, type = "category" }) => {
  const finalImages = [];
  const usedImages = new Set();
  const usedParents = new Set();

  // Round 1: take only 1 product from each category/collection
  for (const item of items) {
    const itemProducts = Array.isArray(item?.products) ? item.products : [];
    const parentKey = getSlug(item);

    if (!itemProducts.length || usedParents.has(parentKey)) continue;

    const product = itemProducts.find((p) => getItemImage(p));

    if (!product) continue;

    const image = getItemImage(product);

    if (!image || usedImages.has(image)) continue;

    usedImages.add(image);
    usedParents.add(parentKey);

    finalImages.push({
      _id: product._id,
      name: product.name || product.title || item.name,
      title: product.name || product.title || item.name,
      image,
      href:
        type === "collection"
          ? `/shop?collection=${getSlug(item)}`
          : `/shop?category=${getSlug(item)}`,
      product,
      parent: item,
    });

    if (finalImages.length === limit) return finalImages;
  }

  // Round 2: if fewer than 3, fill from remaining products
  for (const item of items) {
    const itemProducts = Array.isArray(item?.products) ? item.products : [];

    for (const product of itemProducts) {
      const image = getItemImage(product);

      if (!image || usedImages.has(image)) continue;

      usedImages.add(image);

      finalImages.push({
        _id: product._id,
        name: product.name || product.title || item.name,
        title: product.name || product.title || item.name,
        image,
        href:
          type === "collection"
            ? `/shop?collection=${getSlug(item)}`
            : `/shop?category=${getSlug(item)}`,
        product,
        parent: item,
      });

      if (finalImages.length === limit) return finalImages;
    }
  }

  return finalImages;
};