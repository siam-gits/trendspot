export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    tags: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(limit = 100, skip = 0): Promise<Product[]> {
    const res = await fetch(
        `${BASE_URL}/products?limit=${limit}&skip=${skip}&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images,tags`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    const data: ProductsResponse = await res.json();
    return data.products;
}

export async function fetchProductById(id: string | number): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    return res.json();
}

export async function searchProducts(query: string): Promise<Product[]> {
    const res = await fetch(
        `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=100`,
        { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to search products");
    const data: ProductsResponse = await res.json();
    return data.products;
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const results = await Promise.all(
        ids.map((id) =>
            fetch(`${BASE_URL}/products/${id}`, { next: { revalidate: 3600 } }).then(
                (r) => (r.ok ? r.json() : null)
            )
        )
    );
    return results.filter(Boolean);
}

export function groupByBrand(
    products: Product[],
    maxBrands = 6,
    maxPerBrand = 4
): Record<string, Product[]> {
    // Sort by rating descending
    const sorted = [...products].sort((a, b) => b.rating - a.rating);

    const brandMap: Record<string, Product[]> = {};

    for (const product of sorted) {
        const brand = product.brand || "Other";
        if (!brandMap[brand]) brandMap[brand] = [];
        if (brandMap[brand].length < maxPerBrand) {
            brandMap[brand].push(product);
        }
    }

    // Limit to maxBrands (pick brands with most products)
    const sortedBrands = Object.entries(brandMap)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, maxBrands);

    return Object.fromEntries(sortedBrands);
}
