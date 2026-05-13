import { apiFetch } from "./api";

export interface ShipmentItem {
  name: string;
  vendor: string;
  quantity: number;
}

export interface TimelineEvent {
  label: string;
  time: string;
  done: boolean;
  current?: boolean;
}

export interface ShipmentAddress {
  street: string;
  city: string;
  region: string;
  country?: string;
  postalCode?: string;
}

export interface ShipmentRecipient {
  name: string;
  phone: string;
  email?: string;
}

export interface Shipment {
  id: string;
  orderRef: string;
  status: string;
  createdAt: string;
  address: ShipmentAddress;
  recipient: ShipmentRecipient;
  carrier?: string;
  notes?: string;
  items: ShipmentItem[];
  timeline: TimelineEvent[];
}

export interface LogisticsOverview {
  stats: {
    total: number;
    delivered: number;
    inTransit: number;
    pending: number;
  };
  recentShipments: Shipment[];
}

export interface ShipmentsResponse {
  shipments: Shipment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateShipmentPayload {
  orderRef: string;
  address: {
    street: string;
    city: string;
    region: string;
  };
  recipient: {
    name: string;
    phone: string;
  };
  carrier?: string;
  notes?: string;
}

export interface UpdateShipmentStatusPayload {
  status: string;
  note?: string;
  notifyCustomer?: boolean;
}

export function getLogisticsOverview(): Promise<LogisticsOverview> {
  return apiFetch<LogisticsOverview>("/logistics/overview", {}, true);
}

export function getShipments(params?: {
  page?: number;
  search?: string;
  status?: string;
}): Promise<ShipmentsResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.search) qs.set("search", params.search);
  if (params?.status && params.status !== "All") qs.set("status", params.status);
  const query = qs.toString();
  return apiFetch<ShipmentsResponse>(`/logistics/shipments${query ? `?${query}` : ""}`, {}, true);
}

export function getShipment(id: string): Promise<Shipment> {
  return apiFetch<Shipment>(`/logistics/shipments/${id}`, {}, true);
}

export function createShipment(payload: CreateShipmentPayload): Promise<Shipment> {
  return apiFetch<Shipment>("/logistics/shipments", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export function updateShipmentStatus(
  id: string,
  payload: UpdateShipmentStatusPayload
): Promise<Shipment> {
  return apiFetch<Shipment>(`/logistics/shipments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, true);
}
