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
  selectedFile: File | null = null;
  imagePreview: string | null = null; // Pour afficher l'image

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

          // Afficher l'image existante
          this.imagePreview = product.imageUrl ? 'http://localhost:8081' + product.imageUrl : null;

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

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      // Aperçu de l'image
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.productId) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('sku', this.productForm.get('sku')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('stock', this.productForm.get('stock')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.productService.updateProductWithImage(this.productId, formData).subscribe({
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
