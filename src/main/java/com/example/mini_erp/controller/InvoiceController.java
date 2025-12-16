package com.example.mini_erp.controller;

import com.example.mini_erp.model.Invoice;
import com.example.mini_erp.model.Order;
import com.example.mini_erp.model.User;
import com.example.mini_erp.service.InvoiceService;
import com.example.mini_erp.service.OrderService;
import com.example.mini_erp.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.authentication.UserServiceBeanDefinitionParser;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final OrderService orderService;
    private final UserService userService;

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
  // Télécharger la facture d'une commande (seulement si elle appartient à l'user connecté)
@GetMapping("/download/order/{orderId}")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public ResponseEntity<byte[]> downloadInvoiceByOrderId(
        @PathVariable Long orderId,
        Authentication authentication) throws Exception {

    // Récupérer l'utilisateur connecté
    String username = authentication.getName();
    User currentUser = userService.findByUsername(username);

    // Récupérer la commande
    Order order = orderService.getOrderById(orderId);

    // Vérification de propriété (sécurité principale !)
    if (!order.getUser().getId().equals(currentUser.getId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé : cette commande ne vous appartient pas");
    }

    // Vérifier que la facture existe
    Invoice invoice = order.getInvoice();
    if (invoice == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucune facture trouvée pour cette commande");
    }

    byte[] pdfBytes = invoiceService.getInvoicePdf(invoice.getFileName());

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + invoice.getFileName() + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfBytes);
}
    // Lister toutes les factures (ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }


@GetMapping("/download/{fileName}")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public ResponseEntity<Resource> download(@PathVariable String fileName) throws IOException {

    Path path = Paths.get("invoices").resolve(fileName);

    Resource resource = new InputStreamResource(Files.newInputStream(path));

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + fileName + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(resource);
}


@GetMapping("/my")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public ResponseEntity<List<Invoice>> getMyInvoices(Authentication authentication) {
    String username = authentication.getName();
    User currentUser = userService.findByUsername(username);
    List<Invoice> invoices = invoiceService.getInvoicesByUser(currentUser);
    return ResponseEntity.ok(invoices);
}



}
