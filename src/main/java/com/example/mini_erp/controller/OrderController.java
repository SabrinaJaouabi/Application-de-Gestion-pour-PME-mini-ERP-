package com.example.mini_erp.controller;
import com.example.mini_erp.model.Invoice;
import com.example.mini_erp.model.Order;
import com.example.mini_erp.model.OrderItem;
import com.example.mini_erp.model.PaymentStatus;
import com.example.mini_erp.model.User;
import com.example.mini_erp.repository.UserRepository;
import com.example.mini_erp.service.InvoiceService;
import com.example.mini_erp.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
private final OrderService orderService;
private final UserRepository userRepository; // ← Injecté grâce à Lombok
private final InvoiceService invoiceService;

    // ADMIN et USER peuvent voir toutes leurs commandes
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId){
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    // ADMIN peut voir toutes les commandes
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders(){
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET commande par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id){
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // Créer une commande
 @PostMapping("/user/{userId}")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public ResponseEntity<Order> createOrder(
        @PathVariable Long userId,
        @RequestBody List<OrderItem> items,
        Authentication authentication) {  // ← Ajouté

    // Récupère l'utilisateur connecté via le token
    String connectedUsername = authentication.getName();
    User connectedUser = userRepository.findByUsername(connectedUsername)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

    // Sécurité : un USER ne peut passer commande que pour lui-même
    if (!connectedUser.getRole().equals("ROLE_ADMIN") && !connectedUser.getId().equals(userId)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez passer une commande que pour vous-même");
    }

    // Tout est OK → on crée la commande
    Order order = orderService.createOrder(userId, items);
    return ResponseEntity.ok(order);
}



    // Supprimer commande (ADMIN seulement)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id){
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order deleted successfully");
    }

   
@PostMapping("/{orderId}/pay")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public ResponseEntity<Invoice> payOrder(@PathVariable Long orderId) {

    Order order = orderService.getOrderById(orderId);

    if (order.getPaymentStatus() == PaymentStatus.PAID) {
        throw new RuntimeException("Commande déjà payée");
    }

    // 1️⃣ Marquer comme payée
    order.setPaymentStatus(PaymentStatus.PAID);
    orderService.save(order);

    // 2️⃣ Générer facture
    Invoice invoice = invoiceService.generateAndSaveInvoice(order);

    return ResponseEntity.ok(invoice);
}


}
