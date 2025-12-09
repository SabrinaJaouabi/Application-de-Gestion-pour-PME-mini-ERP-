package com.example.mini_erp.service;
import com.example.mini_erp.model.Order;
import com.example.mini_erp.model.OrderItem;
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

    @Transactional
public Order createOrder(Long userId, List<OrderItem> items) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    Order order = new Order();
    order.setUser(user);
    order.setOrderDate(LocalDateTime.now());
    order.setItems(items);

    items.forEach(item -> item.setOrder(order));

    // ⚡ Calcul du total avec BigDecimal
    BigDecimal total = items.stream()
            .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    order.setTotalAmount(total);

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
}
