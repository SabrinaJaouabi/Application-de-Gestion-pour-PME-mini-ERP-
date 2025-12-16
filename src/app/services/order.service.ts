import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) { }

  // Récupérer les commandes d'un user (pour USER et ADMIN)
  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Récupérer toutes les commandes (ADMIN seulement)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // Récupérer une commande par ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Créer une commande
  createOrder(userId: number, items: any[]): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/user/${userId}`, items);
  }

  // Supprimer une commande (ADMIN)
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  // payer une commande
payOrder(orderId: number) {
  return this.http.post<Order>(
    `${this.apiUrl}/${orderId}/pay`,
    {}
  );
}

// télécharger la facture
downloadInvoice(orderId: number) {
  return this.http.get(
    `http://localhost:8081/api/invoices/${orderId}`,
    { responseType: 'blob' }
  );
}
}
