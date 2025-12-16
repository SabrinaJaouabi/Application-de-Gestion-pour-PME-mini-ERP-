package com.example.mini_erp.dto;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ProductRequestDTO {
private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String sku;
    private MultipartFile image; // Le fichier image uploadé
}
