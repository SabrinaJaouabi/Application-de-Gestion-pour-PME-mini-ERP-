package com.example.mini_erp.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.mini_erp.service.DashboardService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
private final DashboardService dashboardService;

    // Nombre de commandes par mois
    @GetMapping("/orders/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getMonthlyOrders() {
        return ResponseEntity.ok(dashboardService.getMonthlyOrdersStats());
    }

    // Ventes totales par produit
    @GetMapping("/products/sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getProductSales() {
        return ResponseEntity.ok(dashboardService.getProductSalesStats());
    }

    // Produits en rupture de stock (stock < 5)
    @GetMapping("/products/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getLowStockProducts() {
        return ResponseEntity.ok(dashboardService.getLowStockProducts());
    }

    // Total ventes et commandes
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }
}
