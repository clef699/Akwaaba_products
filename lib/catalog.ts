import { apiFetch } from "./api";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating?: number;
  reviews?: number;
  category?: string;
  description?: string;
  images?: string[];
  countryOfOrigin?: string;
  featured?: boolean;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  count?: number;
}

export interface ProductFilters {
  q?: string;
  brand?: string;
  category?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export function getProducts(
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.category) params.set("category", filters.category);
  if (filters.country) params.set("country", filters.country);
  if (filters.minPrice != null)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page != null) params.set("page", String(filters.page));

  const query = params.toString();
  return apiFetch<ProductsResponse>(
    `/catalog/products${query ? `?${query}` : ""}`
  );
}

export function getProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/catalog/products/${id}`);
}

export function getFeaturedProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/catalog/products/featured");
}

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/catalog/categories");
}
