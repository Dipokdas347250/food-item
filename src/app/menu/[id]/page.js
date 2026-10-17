import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import ProductDetail from "@/components/menu/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Not found · KhanaGhor" };
  return {
    title: `${product.name.en} · ${product.name.bn} · KhanaGhor`,
    description: product.desc.en,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  if (!getProduct(id)) notFound();
  return <ProductDetail id={id} />;
}
