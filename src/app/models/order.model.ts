import { OrderItem } from './order-item.model.model';
import { User } from './user.model';

export interface Order {
  id: number;
  orderDate: string;
  user: User;
    paid: boolean;
  items: any[];
  totalAmount: number;
   invoice?: {
    fileName: string;
  };
}

