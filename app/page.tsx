import type { Metadata } from "next";
import { fetchProducts, groupByBrand } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/auth";
import { getUserFavorites } from "@/actions/favorites";
import { HomeHero } from "@/components/HomeHero";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TrendSpot Store – Discover Trending Demo Products",
};

export default async function HomePage() {
  const [products, session] = await Promise.all([
    fetchProducts(100),
    auth(),
  ]);

  const userFavorites = session ? await getUserFavorites() : [];
  const brandGroups = groupByBrand(products, 6, 4);
  const featuredProducts = products.slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center">
        <HomeHero products={featuredProducts} />
      </section>

      {/* Brand-grouped product sections */}
      {Object.entries(brandGroups).map(([brand, brandProducts]) => (
        <section key={brand} className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">{brand}</h2>
              <p className="text-sm text-muted-foreground">
                Top rated picks from {brand}
              </p>
            </div>
            <Link
              href={`/products?search=${encodeURIComponent(brand)}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brandProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorited={userFavorites.includes(String(product.id))}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
