import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    // Limite taille (optionnel)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image trop lourde (max 10 Mo)');
      return;
    }

    // Vérifier type image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    this.selectedFile = file;

    // Aperçu
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    // Ajouter tous les champs texte
    formData.append('name', this.productForm.get('name')!.value.trim());
    formData.append('sku', this.productForm.get('sku')!.value.trim());
    formData.append('description', this.productForm.get('description')!.value || '');
    formData.append('price', this.productForm.get('price')!.value.toString());
    formData.append('stock', this.productForm.get('stock')!.value.toString());

    // Ajouter l'image si sélectionnée
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.productService.createProduct(formData).subscribe({
      next: (product) => {
        alert('Produit ajouté avec succès !');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Erreur création produit', err);
        const msg = err.error?.message || err.message || 'Erreur inconnue lors de la création.';
        alert('Erreur : ' + msg);
      }
    });
  }
}