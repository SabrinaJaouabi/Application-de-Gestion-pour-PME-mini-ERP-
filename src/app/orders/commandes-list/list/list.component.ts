import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponentcommande implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des commandes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Supprimer cette commande ?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== id);
        },
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }

getFullName(order: Order): string {
  return order.user?.fullName || order.user?.username || 'Inconnu';
}

}
