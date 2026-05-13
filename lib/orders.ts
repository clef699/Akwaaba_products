import { apiFetch } from "./api";

export interface OrderItem {
  productId: string;
  qty: number;
  name?: string;
  vendor?: string;
  price?: number;
}

export interface ShippingAddress {
  name?: string;
  country: string;
  city?: string;
  state?: string;
  line1: string;
  line2?: string;
}

export interface OrderTimeline {
  step: string;
  time: string;
  done: boolean;
  isFirst?: boolean;
}

export interface OrderPayload {
  items: Array<{ productId: string; qty: number }>;
  currency: string;
  shippingAddress: ShippingAddress;
  payment: {
    provider: string;
    transactionId: string;
    status: string;
  };
}

export interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  currency: string;
  shippingAddress: ShippingAddress;
  total?: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  createdAt?: string;
  payment?: {
    provider?: string;
    method?: string;
    last4?: string;
    transactionId?: string;
    status?: string;
  };
  timeline?: OrderTimeline[];
}

export function placeOrder(payload: OrderPayload): Promise<Order> {
  return apiFetch<Order>(
    "/orders",
    { method: "POST", body: JSON.stringify(payload) },
    true
  );
}

export function getOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`, {}, true);
}

export function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders", {}, true);
}
