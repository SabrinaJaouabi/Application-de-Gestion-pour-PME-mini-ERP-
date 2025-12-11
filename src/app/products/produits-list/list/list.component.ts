import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppConfirmDialogComponent } from '../../../app-confirm-dialog/app-confirm-dialog.component';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink,MatDialogModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  products: Product[] = [];

  // Colonnes pour ADMIN (avec SKU et Actions)
  displayedColumns: string[] = ['sku', 'name', 'price', 'stock', 'actions'];

  // Colonnes pour USER (avec SKU mais sans Actions)
  userColumns: string[] = ['sku', 'name', 'price', 'stock'];

  isAdmin: boolean = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.isAdmin = this.authService.getRole()?.includes('ADMIN') || false;
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(AppConfirmDialogComponent, {
      width: '400px',
      data: { } // Tu peux passer le nom du produit si tu veux : data: { productName: product.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            // Recharger la liste pour voir le résultat immédiatement
            this.loadProducts();
          },
          error: (err) => {
            alert('Erreur lors de la suppression du produit');
            console.error(err);
          }
        });
      }
    });
  }
}