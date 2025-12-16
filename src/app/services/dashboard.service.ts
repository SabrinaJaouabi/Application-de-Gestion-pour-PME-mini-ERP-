import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) { }

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  getMonthlyOrders(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/orders/monthly`);
  }

  getProductSales(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/products/sales`);
  }

  getLowStockProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/low-stock`);
  }
}