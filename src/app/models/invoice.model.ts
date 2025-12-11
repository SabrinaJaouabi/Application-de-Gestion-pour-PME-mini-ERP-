import { Order } from "./order.model";

export interface Invoice {
  id: number;
  order: Order;
  createdAt: string;
  fileName: string;
}
