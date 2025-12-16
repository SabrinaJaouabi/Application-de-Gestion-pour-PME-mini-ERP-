package com.example.mini_erp.service;

import com.example.mini_erp.dto.ProductRequestDTO;
import com.example.mini_erp.model.Product;
import com.example.mini_erp.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final FileService fileService; // Injection du service de fichiers

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID : " + id));
    }

    // === CRÉATION avec image ===
    public Product createProduct(ProductRequestDTO dto) throws IOException {
        // Vérifier SKU unique
        if (productRepository.findBySku(dto.getSku()).isPresent()) {
            throw new RuntimeException("Le SKU existe déjà");
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setSku(dto.getSku());

        // Gestion de l'image
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String fileName = fileService.saveFile(dto.getImage());
            product.setImageUrl(fileService.getFileUrl(fileName));
        }

        return productRepository.save(product);
    }

    // === MISE À JOUR avec image ===
    public Product updateProduct(Long id, ProductRequestDTO dto) throws IOException {
        Product product = getProductById(id);

        // Mise à jour des champs texte
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        // SKU : on peut autoriser ou non la modification (ici on autorise, mais vérifie unicité)
        if (!product.getSku().equals(dto.getSku())) {
            if (productRepository.findBySku(dto.getSku()).isPresent()) {
                throw new RuntimeException("Ce SKU est déjà utilisé par un autre produit");
            }
            product.setSku(dto.getSku());
        }

        // Gestion de l'image
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            // Supprimer l'ancienne image si elle existe
            if (product.getImageUrl() != null) {
                String oldFileName = extractFileNameFromUrl(product.getImageUrl());
                fileService.deleteFile(oldFileName);
            }

            // Sauvegarder la nouvelle
            String newFileName = fileService.saveFile(dto.getImage());
            product.setImageUrl(fileService.getFileUrl(newFileName));
        }
        // Si dto.getImage() == null → on garde l'image existante

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) throws IOException {
        Product product = getProductById(id);

        // Supprimer l'image associée avant de supprimer le produit
        if (product.getImageUrl() != null) {
            String fileName = extractFileNameFromUrl(product.getImageUrl());
            fileService.deleteFile(fileName);
        }

        productRepository.delete(product);
    }

    // Utilitaire pour extraire le nom du fichier depuis l'URL
    private String extractFileNameFromUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }
        return imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    }
}