import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { AppConfirmDialogComponent } from '../../../app-confirm-dialog/app-confirm-dialog.component';
import { CheckoutDialogComponent } from '../../../checkout-dialog/checkout-dialog.component';
import { AppSuccessDialogComponentComponent } from '../../../app-success-dialog-component/app-success-dialog-component.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatDialogModule,
    CheckoutDialogComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['image', 'sku', 'name', 'price', 'stock', 'actions', 'cart'];
  userColumns: string[] = ['image', 'sku', 'name', 'price', 'stock', 'cart'];

  isAdmin = false;
  loading = true;
  hasError = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private dialog: MatDialog,
    public cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole()?.includes('ADMIN') ?? false;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.hasError = false;

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits :', err);
        this.hasError = true;
        this.loading = false;
      }
    });
  }

  // Construit l'URL complète de l'image avec le bon backend
  getImageUrl(imageUrl: string | null | undefined): string {
    if (imageUrl) {
      return `${environment.apiUrl}${imageUrl}`; // ex: http://localhost:8080/uploads/products/xxx.png
    }
    return 'assets/images/no-image.png'; // Image par défaut locale
  }

  // Fallback si l'image ne charge pas (404 ou 403)
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/no-image.png';
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(AppConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Supprimer le produit', message: 'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => this.loadProducts(),
          error: () => this.dialog.open(AppConfirmDialogComponent, {
            data: { title: 'Erreur', message: 'Impossible de supprimer le produit.' }
          })
        });
      }
    });
  }

  addToCart(product: Product): void {
    if (product.stock > 0) {
      this.cartService.addProduct(product, 1);
    }
  }

  checkout(): void {
    const totalItems = this.cartService.getTotalItems();

    if (totalItems === 0) {
      this.dialog.open(AppConfirmDialogComponent, {
        data: { title: 'Panier vide', message: 'Votre panier est actuellement vide.' }
      });
      return;
    }

    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      width: '600px',
      data: {
        items: this.cartService.getItems(),
        totalItems,
        totalPrice: this.cartService.getTotalPrice()
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      const itemsToSend = this.cartService.getItems().map(item => ({
        product: { id: item.product.id },
        quantity: item.quantity
      }));

      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        this.dialog.open(AppConfirmDialogComponent, {
          data: { title: 'Erreur', message: 'Utilisateur non authentifié.' }
        });
        return;
      }

      this.orderService.createOrder(userId, itemsToSend).subscribe({
        next: (order) => {
          this.cartService.clear();
          this.dialog.open(AppSuccessDialogComponentComponent, {
            data: {
              title: 'Commande validée !',
              message: `Votre commande n°<strong>${order.id}</strong> a été passée avec succès.<br>Merci pour votre achat !`,
              confirmText: 'Continuer les achats'
            }
          });
        },
        error: (err) => {
          const message = err.error?.message || 'Une erreur est survenue lors de la validation de la commande.';
          this.dialog.open(AppConfirmDialogComponent, {
            data: { title: 'Erreur commande', message }
          });
        }
      });
    });
  }
}