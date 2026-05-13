import { apiFetch } from "./api";

export interface VendorStats {
  totalRevenue: number;
  totalOrders: number;
  listedProducts: number;
  avgOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  avgOrderChange: number;
  revenueChart: number[];
  topProducts: VendorTopProduct[];
  recentOrders: VendorOrder[];
}

export interface VendorTopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface VendorProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Out of Stock" | "Low Stock" | "Draft" | "Archived";
  sku?: string;
  description?: string;
  comparePrice?: number;
  lowStockAlert?: number;
  images?: string[];
}

export interface VendorOrder {
  id: string;
  product: string;
  customer: string;
  date: string;
  amount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items?: VendorOrderItem[];
  shippingAddress?: string;
}

export interface VendorOrderItem {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
}

export interface VendorOrdersStats {
  totalOrders: number;
  processing: number;
  shipped: number;
  delivered: number;
}

export interface VendorPayout {
  id: string;
  period: string;
  orders: number;
  gross: number;
  fee: number;
  net: number;
  status: "Completed" | "Pending" | "Processing";
}

export interface VendorPayoutSummary {
  totalEarnings: number;
  pendingPayout: number;
  platformFee: number;
  netPaidOut: number;
  payouts: VendorPayout[];
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  lowStockAlert?: number;
  status: string;
  images?: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export function getDashboardStats(): Promise<VendorStats> {
  return apiFetch<VendorStats>("/vendor/dashboard/stats", {}, true);
}

export function getProducts(): Promise<VendorProduct[]> {
  return apiFetch<VendorProduct[]>("/vendor/products", {}, true);
}

export function getProduct(id: string): Promise<VendorProduct> {
  return apiFetch<VendorProduct>(`/vendor/products/${id}`, {}, true);
}

export function createProduct(payload: CreateProductPayload): Promise<VendorProduct> {
  return apiFetch<VendorProduct>("/vendor/products", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export function updateProduct(id: string, payload: UpdateProductPayload): Promise<VendorProduct> {
  return apiFetch<VendorProduct>(`/vendor/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, true);
}

export function deleteProduct(id: string): Promise<void> {
  return apiFetch<void>(`/vendor/products/${id}`, { method: "DELETE" }, true);
}

export function getOrders(): Promise<{ stats: VendorOrdersStats; orders: VendorOrder[] }> {
  return apiFetch<{ stats: VendorOrdersStats; orders: VendorOrder[] }>("/vendor/orders", {}, true);
}

export function getOrder(id: string): Promise<VendorOrder> {
  return apiFetch<VendorOrder>(`/vendor/orders/${id}`, {}, true);
}

export function getPayouts(): Promise<VendorPayoutSummary> {
  return apiFetch<VendorPayoutSummary>("/vendor/payouts", {}, true);
}

export function requestPayout(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/vendor/payout-requests", { method: "POST" }, true);
}
