import { apiFetch } from "./api";

export interface CustomerAddress {
  id: string;
  label: string;
  isDefault: boolean;
  name: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
}

export interface CreateAddressPayload {
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  cardholder: string;
  expires: string;
  isDefault: boolean;
}

export function getAddresses(): Promise<CustomerAddress[]> {
  return apiFetch<CustomerAddress[]>("/customer/addresses", {}, true);
}

export function createAddress(payload: CreateAddressPayload): Promise<CustomerAddress> {
  return apiFetch<CustomerAddress>("/customer/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export function updateAddress(id: string, payload: UpdateAddressPayload): Promise<CustomerAddress> {
  return apiFetch<CustomerAddress>(`/customer/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, true);
}

export function deleteAddress(id: string): Promise<void> {
  return apiFetch<void>(`/customer/addresses/${id}`, { method: "DELETE" }, true);
}

export function setDefaultAddress(id: string): Promise<CustomerAddress> {
  return apiFetch<CustomerAddress>(`/customer/addresses/${id}/default`, { method: "PATCH" }, true);
}

export function getPaymentMethods(): Promise<PaymentMethod[]> {
  return apiFetch<PaymentMethod[]>("/customer/payment-methods", {}, true);
}

export function deletePaymentMethod(id: string): Promise<void> {
  return apiFetch<void>(`/customer/payment-methods/${id}`, { method: "DELETE" }, true);
}

export function setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
  return apiFetch<PaymentMethod>(`/customer/payment-methods/${id}/default`, { method: "PATCH" }, true);
}
