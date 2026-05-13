export interface CartItem {
  id: string;
  name: string;
  vendor?: string;
  price: number;
  qty: number;
  image?: string;
}
