import type { Metadata } from "next";
import { fetchProductById } from "@/lib/api";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUserFavorites } from "@/actions/favorites";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const product = await fetchProductById(id);
        return {
            title: product.title,
            description: product.description,
        };
    } catch {
        return { title: "Product Not Found" };
    }
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;

    let product;
    try {
        product = await fetchProductById(id);
    } catch {
        notFound();
    }

    const [session] = await Promise.all([auth()]);
    const userFavorites = session ? await getUserFavorites() : [];
    const isFavorited = userFavorites.includes(String(product.id));

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <ProductDetailClient product={product} isFavorited={isFavorited} />
        </div>
    );
}
