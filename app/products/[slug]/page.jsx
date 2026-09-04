import ProductDetailClient from "./ProductDetailClient";

const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (image?.url) return image.url;
  if (image?.secure_url) return image.secure_url;
  return null;
};

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api";
    const res = await fetch(`${baseUrl}/products/slug/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return {};

    const data = await res.json();
    const product =
      data?.data?.product || data?.product || data?.data || data;

    if (!product?.name) return {};

    const firstImage =
      Array.isArray(product.images) && product.images.length > 0
        ? getImageUrl(product.images[0])
        : product.image
          ? getImageUrl(product.image)
          : null;

    const title = `${product.name} | Elmas by Abhinandan Jewellers`;
    const description =
      product.description ||
      "Explore premium 999 pure silver décor, god idols, and gifts at Elmas by Abhinandan Jewellers.";

    return {
      title,
      description,
      openGraph: {
        type: "website",
        locale: "en_IN",
        siteName: "Elmas by Abhinandan Jewellers",
        title,
        description,
        images: firstImage
          ? [{ url: firstImage, width: 1200, height: 630, alt: product.name }]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default function ProductPage({ params }) {
  return <ProductDetailClient slug={params.slug} />;
}
