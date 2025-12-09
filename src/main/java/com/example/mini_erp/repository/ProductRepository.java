package com.example.mini_erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.mini_erp.model.Product;
import java.util.Optional;
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);

}
