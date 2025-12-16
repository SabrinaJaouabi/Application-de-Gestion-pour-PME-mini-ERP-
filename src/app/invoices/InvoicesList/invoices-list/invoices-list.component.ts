import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../../models/invoice.model';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'] // corrigé
})
export class InvoicesListComponent implements OnInit {
invoices: Invoice[] = [];
  loading = true;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.loadMyInvoices();
  }

  loadMyInvoices(): void {
    this.loading = true;
    this.invoiceService.getMyInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement factures', err);
        alert('Impossible de charger vos factures');
        this.loading = false;
      }
    });
  }

  downloadInvoice(invoice: Invoice): void {
    const fileName = invoice.fileName || `facture_${invoice.order.id}.pdf`;
    this.invoiceService.triggerDownload(invoice.order.id, fileName);
  }
}
