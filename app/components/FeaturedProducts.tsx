import Link from "next/link";
import { getFeaturedProducts, type Product } from "@/lib/catalog";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-(--primary)">
      {"★".repeat(Math.floor(rating))}
      <span className="text-gray-700 text-sm ml-1">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export default async function FeaturedProducts() {
  let products: Product[] = [];

  try {
    products = await getFeaturedProducts();
  } catch {
    // API unavailable — fall through to empty state
  }

  if (products.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
        <svg
          className="w-12 h-12 mb-3 text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
        <p className="font-medium text-gray-500">No featured products yet</p>
        <p className="text-sm mt-1">Check back soon — new products are on their way.</p>
        <Link
          href="/shop"
          className="mt-4 text-sm text-(--primary) hover:underline"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-8 gap-6 w-full">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/shop/${product.id}`}
          className="border border-(--gray) rounded-xl overflow-hidden w-full hover:shadow-md transition-shadow"
        >
          <div className="bg-gray-100 h-56 flex items-center justify-center overflow-hidden">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm text-(--gray-text)">{product.brand}</p>
            <h3 className="font-bold text-lg mt-1">{product.name}</h3>
            {product.rating != null && (
              <div className="flex items-center gap-1 mt-2">
                <StarRating rating={product.rating} />
                {product.reviews != null && (
                  <span className="text-gray-500 text-sm">
                    ({product.reviews})
                  </span>
                )}
              </div>
            )}
            <p className="mt-2 font-bold text-(--primary)">${product.price.toFixed(2)}</p>
            <div className="mt-4 w-full bg-(--primary) text-white py-2 rounded-lg font-medium text-center hover:bg-green-700 transition">
              View Product
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-8 gap-6 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border border-(--gray) rounded-xl overflow-hidden w-full animate-pulse"
        >
          <div className="bg-gray-200 h-56 w-full" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-9 bg-gray-200 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
