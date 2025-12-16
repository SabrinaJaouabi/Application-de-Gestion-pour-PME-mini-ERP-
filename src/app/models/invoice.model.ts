import { Order } from "./order.model";

export interface Invoice {
id: number;
  createdAt: string;
  fileName: string;
  order: {
    id: number;
    orderDate: string;
    totalAmount: number;
    // autres champs si besoin
  };
}
