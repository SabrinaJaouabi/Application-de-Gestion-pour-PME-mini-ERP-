import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId(); // à implémenter dans ton AuthService
    this.orderService.getOrdersByUser(userId!).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        alert('Erreur lors du chargement des commandes');
        this.loading = false;
      }
    });
  }

  pay(orderId: number) {
  if (!confirm('Confirmer le paiement ?')) return;

  this.orderService.payOrder(orderId).subscribe({
    next: (updatedOrder) => {
      alert('Paiement effectué ✔️');
      this.ngOnInit(); // refresh commandes
    },
    error: () => alert('Erreur paiement ❌')
  });
}

downloadInvoice(orderId: number) {
  this.orderService.downloadInvoice(orderId).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture_${orderId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

}