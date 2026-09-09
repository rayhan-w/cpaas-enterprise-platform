import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dbService } from '@/lib/db-service';
import ProductView from '@/components/product/ProductView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | Jawata Mart' };
  }

  return {
    title: `${product.name} | Jawata Mart`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await dbService.getProducts({
    categorySlug: product.categorySlug,
    limit: 6,
  });

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id);

  return <ProductView product={product} relatedProducts={filteredRelated} />;
}
