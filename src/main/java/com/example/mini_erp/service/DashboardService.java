package com.example.mini_erp.service;
import com.example.mini_erp.model.Order;
import com.example.mini_erp.repository.OrderRepository;
import com.example.mini_erp.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // Nombre de commandes par mois
    public Map<String, Long> getMonthlyOrdersStats() {
        List<Order> orders = orderRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        return orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().format(formatter),
                        TreeMap::new,
                        Collectors.counting()
                ));
    }

    // Ventes totales par produit
    public Map<String, BigDecimal> getProductSalesStats() {
        Map<String, BigDecimal> sales = new HashMap<>();
        productRepository.findAll().forEach(product -> {
            BigDecimal totalSales = orderRepository.findAll().stream()
                    .flatMap(order -> order.getItems().stream())
                    .filter(item -> item.getProduct().getId().equals(product.getId()))
                    .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            sales.put(product.getName(), totalSales);
        });
        return sales;
    }

    // Produits avec stock faible (< 5)
    public List<Map<String, Object>> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getStock() < 5)
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId());
                    map.put("name", p.getName());
                    map.put("stock", p.getStock());
                    return map;
                })
                .collect(Collectors.toList());
    }

    // Résumé dashboard : total ventes et commandes
    public Map<String, Object> getDashboardSummary() {
        BigDecimal totalSales = orderRepository.findAll().stream()
                .flatMap(order -> order.getItems().stream())
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalSales", totalSales);
        summary.put("totalOrders", totalOrders);
        summary.put("totalProducts", totalProducts);
        return summary;
    }

}
