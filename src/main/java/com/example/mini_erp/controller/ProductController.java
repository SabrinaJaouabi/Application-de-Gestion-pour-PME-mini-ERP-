package com.example.mini_erp.controller;
import com.example.mini_erp.dto.ProductRequestDTO;
import com.example.mini_erp.model.Product;
import com.example.mini_erp.service.FileService;
import com.example.mini_erp.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product create(@ModelAttribute ProductRequestDTO dto) throws IOException {
        return productService.createProduct(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product update(@PathVariable Long id, @ModelAttribute ProductRequestDTO dto) throws IOException {
        return productService.updateProduct(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
