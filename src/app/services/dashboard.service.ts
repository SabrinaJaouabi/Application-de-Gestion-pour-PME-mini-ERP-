import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8081/api/dashboard';

  constructor(private http: HttpClient) { }

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  getMonthlyOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/monthly`);
  }

  getProductSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/sales`);
  }
}
