package com.example.mini_erp.controller;

import com.example.mini_erp.model.Invoice;
import com.example.mini_erp.model.Order;
import com.example.mini_erp.service.InvoiceService;
import com.example.mini_erp.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final OrderService orderService;

    // Créer une facture et la sauvegarder
    @PostMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> createInvoice(@PathVariable Long orderId) throws Exception {
        // Récupérer la commande avec l'utilisateur chargé
        Order order = orderService.getOrderById(orderId);
        if(order.getUser() == null) {
            throw new RuntimeException("Utilisateur non associé à cette commande");
        }

        invoiceService.generateAndSaveInvoice(order);
        return ResponseEntity.ok("Facture générée avec succès !");
    }

    // Télécharger une facture PDF
    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long orderId) throws Exception {
        Order order = orderService.getOrderById(orderId);

        // Vérifie que la facture existe
        Invoice invoice = order.getInvoice();
        if(invoice == null) {
            throw new RuntimeException("Aucune facture trouvée pour cette commande");
        }

        byte[] pdfBytes = invoiceService.getInvoicePdf(invoice.getFileName());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + invoice.getFileName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // Lister toutes les factures (ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

}
