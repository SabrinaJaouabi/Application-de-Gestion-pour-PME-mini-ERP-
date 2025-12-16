import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { OrderService } from './order.service';
import { AuthService } from './auth.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private orderService: OrderService, private authService: AuthService) {}

  addProduct(product: Product, qty: number = 1) {
    const items = this.itemsSubject.value;
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({ product, quantity: qty });
    }
    this.itemsSubject.next([...items]);
  }

  removeProduct(productId: number) {
    const items = this.itemsSubject.value.filter(i => i.product.id !== productId);
    this.itemsSubject.next(items);
  }

  clear() {
    this.itemsSubject.next([]);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  getTotalItems(): number {
    return this.itemsSubject.value.reduce((acc, i) => acc + i.quantity, 0);
  }

  getTotalPrice(): number {
    return this.itemsSubject.value.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  }

  // ✅ Nouvelle méthode simplifiée pour passer commande
  checkoutOrder() {
    if (this.getTotalItems() === 0) throw new Error('Panier vide !');

    const userId = this.authService.getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté !');

    const itemsToSend = this.getItems().map(i => ({
      product: { id: i.product.id },
      quantity: i.quantity
    }));

    return this.orderService.createOrder(userId, itemsToSend);
  }
}
