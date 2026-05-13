import { apiFetch } from "./api";

export interface AdminStats {
  totalRevenue: number;
  totalRevenueChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  totalUsers: number;
  totalUsersChange: number;
  activeVendors: number;
  activeVendorsChange: number;
  revenueChart: number[];
  recentOrders: AdminRecentOrder[];
  topProducts: AdminTopProduct[];
}

export interface AdminRecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

export interface AdminTopProduct {
  id: string;
  name: string;
  vendor: string;
  unitsSold: number;
  revenue: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin" | string;
  division?: string;
  status: "active" | "suspended" | string;
  joinedAt: string;
  ordersCount?: number;
  totalSpent?: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  customerId: string;
  vendor: string;
  items: AdminOrderItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  createdAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminDivision {
  id: string;
  name: string;
  code: string;
  description?: string;
  staffCount: number;
  createdAt: string;
}

export interface CreateDivisionPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDivisionPayload extends Partial<CreateDivisionPayload> {}

export interface AdminAnalytics {
  totalRevenue: number;
  totalRevenueChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
  revenueChart: number[];
  categoryChart: { label: string; value: number }[];
  topProducts: { id: string; name: string; unitsSold: number; revenue: number }[];
  topVendors: { id: string; name: string; orders: number; revenue: number }[];
}

export interface LedgerTransaction {
  id: string;
  date: string;
  description: string;
  from: string;
  to: string;
  amount: number;
  positive: boolean;
}

export interface LedgerResponse {
  transactions: LedgerTransaction[];
  totalCredits: number;
  totalDebits: number;
  total: number;
  page: number;
  pageSize: number;
}

export interface AIForecastResult {
  productId: string;
  productName: string;
  confidence: number;
  predictedTotal: number;
  dailyAverage: number;
  peakDay: string;
  trendPercent: number;
  chartData: number[];
  dailyForecast: { date: string; day: string; units: number; confidence: number }[];
}

export interface FinanceOverview {
  totalRevenue: number;
  totalRevenueChange: number;
  totalExpenses: number;
  expensesRatio: number;
  netProfit: number;
  netProfitChange: number;
  revenueChart: number[];
  expensesChart: number[];
  recentTransactions: { description: string; date: string; amount: number; positive: boolean }[];
  topProducts: { name: string; revenue: number }[];
}

export interface VendorPayout {
  id: string;
  vendor: string;
  amount: number;
  period: string;
  dateProcessed: string | null;
  status: "PROCESSED" | "PENDING" | "FAILED" | string;
}

export interface VendorPayoutsResponse {
  payouts: VendorPayout[];
  totalPaidOut: number;
  totalPending: number;
}

export function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats", {}, true);
}

export function getUsers(params?: {
  page?: number;
  search?: string;
  role?: string;
}): Promise<AdminUsersResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.search) qs.set("search", params.search);
  if (params?.role && params.role !== "all") qs.set("role", params.role);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminUsersResponse>(`/admin/users${query}`, {}, true);
}

export function getUser(id: string): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/admin/users/${id}`, {}, true);
}

export function patchUserRole(id: string, role: string, division?: string): Promise<AdminUser> {
  return apiFetch<AdminUser>(
    `/admin/users/${id}/role`,
    { method: "PATCH", body: JSON.stringify({ role, division }) },
    true
  );
}

export function getOrders(params?: {
  page?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<AdminOrdersResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.search) qs.set("search", params.search);
  if (params?.status && params.status !== "all") qs.set("status", params.status);
  if (params?.startDate) qs.set("startDate", params.startDate);
  if (params?.endDate) qs.set("endDate", params.endDate);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminOrdersResponse>(`/admin/orders${query}`, {}, true);
}

export function getOrder(id: string): Promise<AdminOrder> {
  return apiFetch<AdminOrder>(`/admin/orders/${id}`, {}, true);
}

export function getDivisions(): Promise<AdminDivision[]> {
  return apiFetch<AdminDivision[]>("/admin/divisions", {}, true);
}

export function createDivision(payload: CreateDivisionPayload): Promise<AdminDivision> {
  return apiFetch<AdminDivision>("/admin/divisions", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export function updateDivision(id: string, payload: UpdateDivisionPayload): Promise<AdminDivision> {
  return apiFetch<AdminDivision>(`/admin/divisions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, true);
}

export function getAnalytics(period?: string): Promise<AdminAnalytics> {
  const query = period ? `?period=${period}` : "";
  return apiFetch<AdminAnalytics>(`/admin/analytics${query}`, {}, true);
}

export function getLedger(params?: {
  page?: number;
  search?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<LedgerResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.search) qs.set("search", params.search);
  if (params?.type && params.type !== "all") qs.set("type", params.type);
  if (params?.dateFrom) qs.set("dateFrom", params.dateFrom);
  if (params?.dateTo) qs.set("dateTo", params.dateTo);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<LedgerResponse>(`/admin/finance/ledger${query}`, {}, true);
}

export function getAIForecast(productId: string): Promise<AIForecastResult> {
  return apiFetch<AIForecastResult>(`/admin/ai/forecast?productId=${encodeURIComponent(productId)}`, {}, true);
}

export function getFinanceOverview(period?: string): Promise<FinanceOverview> {
  const query = period ? `?period=${period}` : "";
  return apiFetch<FinanceOverview>(`/admin/finance/overview${query}`, {}, true);
}

export function getVendorPayouts(params?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<VendorPayoutsResponse> {
  const qs = new URLSearchParams();
  if (params?.status && params.status !== "all") qs.set("status", params.status);
  if (params?.dateFrom) qs.set("dateFrom", params.dateFrom);
  if (params?.dateTo) qs.set("dateTo", params.dateTo);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<VendorPayoutsResponse>(`/admin/finance/vendor-payouts${query}`, {}, true);
}
