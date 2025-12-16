import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient,private authService:AuthService) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

createProduct(data: any): Observable<Product> {
  return this.http.post<Product>(`${environment.apiUrl}/api/products`, data);
}
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    // Nouvelle méthode pour update avec FormData (image possible)
// Angular : ajout du JWT dans le header
updateProductWithImage(id: number, formData: FormData) {
  return this.http.put(`${this.apiUrl}/${id}`, formData, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
  });
}

}
