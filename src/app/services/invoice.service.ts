import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';
import { AuthService } from './auth.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8081/api/invoices';

  constructor(private http: HttpClient, private authService: AuthService) { }
// Lister les factures de l'utilisateur connecté
  getMyInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/my`);
  }

  // Télécharger la facture PDF par ID de commande
  downloadInvoice(orderId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/order/${orderId}`, {
      responseType: 'blob'
    });
  }

  // Méthode utilitaire pour déclencher le téléchargement
  triggerDownload(orderId: number, fileName: string): void {
    this.downloadInvoice(orderId).subscribe({
      next: (blob: Blob) => {
        saveAs(blob, fileName);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement de la facture', err);
        alert('Impossible de télécharger la facture. Vérifiez qu\'elle existe.');
      }
    });
  }

   
}
