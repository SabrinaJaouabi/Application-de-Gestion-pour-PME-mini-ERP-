import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  generate(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${orderId}`, null, { responseType: 'text' });
  }

  download(orderId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${orderId}`, { responseType: 'blob' });
  }
}
