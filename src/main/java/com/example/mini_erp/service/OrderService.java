package com.example.mini_erp.service;
import com.example.mini_erp.model.Invoice;
import com.example.mini_erp.model.Order;
import com.example.mini_erp.model.OrderItem;
import com.example.mini_erp.model.PaymentStatus;
import com.example.mini_erp.model.Product;
import com.example.mini_erp.model.User;
import com.example.mini_erp.repository.OrderRepository;
import com.example.mini_erp.repository.ProductRepository;
import com.example.mini_erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
 private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
        private final InvoiceService invoiceService;

@Transactional
public Order createOrder(Long userId, List<OrderItem> items) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    Order order = new Order();
    order.setUser(user);
    order.setOrderDate(LocalDateTime.now());
    order.setItems(items);
    order.setPaymentStatus(PaymentStatus.PENDING); // par sécurité
    order.setPaid(false); // par sécurité

    BigDecimal totalAmount = BigDecimal.ZERO;

    for (OrderItem item : items) {
        Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé : " + item.getProduct().getId()));

        if (product.getStock() < item.getQuantity()) {
            throw new RuntimeException("Stock insuffisant pour le produit : " + product.getName());
        }

        product.setStock(product.getStock() - item.getQuantity());
        productRepository.save(product);

        item.setPrice(product.getPrice());
        item.setOrder(order);

        totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
    }

    order.setTotalAmount(totalAmount);

    return orderRepository.save(order);
}







public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

public Order getOrderById(Long id){
    return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Commande introuvable"));
}

    public void deleteOrder(Long id) {
        Order order = getOrderById(id);

        // Restaurer le stock des produits
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        orderRepository.delete(order);
    }


 public Order payOrder(Long orderId) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Commande introuvable"));

    // Vérifier si déjà payée
    if (order.getPaymentStatus() == PaymentStatus.PAID) {
        throw new RuntimeException("Commande déjà payée");
    }

    // 1️⃣ Paiement simulé
    order.setPaymentStatus(PaymentStatus.PAID);

    // 2️⃣ Générer la facture
    Invoice invoice = invoiceService.generateAndSaveInvoice(order);

    // 3️⃣ Lier facture ↔ commande
    order.setInvoice(invoice);

    // 4️⃣ Sauvegarder
    return orderRepository.save(order);
}

    public Order save(Order order) {
        return orderRepository.save(order);
    }

}
