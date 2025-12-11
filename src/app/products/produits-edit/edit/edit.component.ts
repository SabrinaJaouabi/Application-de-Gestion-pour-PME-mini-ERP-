import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: [0]
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product: Product) => {
          this.productForm.patchValue({
            name: product.name,
            sku: product.sku,
            description: product.description || '',
            price: product.price,
            stock: product.stock || 0
          });
          this.loading = false;
        },
        error: (err) => {
          alert('Erreur lors du chargement du produit');
          console.error(err);
          this.loading = false;
          this.router.navigate(['/products']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.productId) {
      const updatedProduct: Product = {
        ...this.productForm.value,
        id: this.productId
      };

      this.productService.updateProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          alert('Produit modifié avec succès !');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          alert('Erreur lors de la modification');
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

}
