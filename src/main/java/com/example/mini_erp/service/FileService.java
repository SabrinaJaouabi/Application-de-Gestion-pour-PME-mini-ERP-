package com.example.mini_erp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    // Dossier de stockage (tu peux le rendre configurable plus tard via application.properties)
    private static final String UPLOAD_DIR = "uploads/products/";

    /**
     * Sauvegarde un fichier uploadé et retourne le nom du fichier généré
     */
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide ou null");
        }

        // Sécurité : valider le type de contenu (optionnel mais recommandé)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Seules les images sont autorisées");
        }

        // Créer le dossier s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Extraire l'extension de manière sécurisée
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);

        // Générer un nom unique
        String fileName = UUID.randomUUID().toString() + extension;

        // Chemin final
        Path filePath = uploadPath.resolve(fileName);

        // Sauvegarder le fichier
        Files.write(filePath, file.getBytes());

        // Retourner uniquement le nom du fichier (ou l'URL complète si tu préfères)
        return fileName;
    }

    /**
     * Retourne l'URL publique pour accéder à l'image
     */
    public String getFileUrl(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return null;
        }
        return "/uploads/products/" + fileName;
    }

    /**
     * Supprime un fichier existant (utile lors de la mise à jour d'un produit)
     */
    public void deleteFile(String fileName) throws IOException {
        if (fileName == null || fileName.isBlank()) {
            return;
        }
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
        Files.deleteIfExists(filePath);
    }

    /**
     * Extrait l'extension d'un nom de fichier de manière sécurisée
     */
    private String getFileExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank() || !originalFilename.contains(".")) {
            return ".jpg"; // extension par défaut si inconnue
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        // Sécurité basique : limiter les extensions autorisées
        return switch (extension.toLowerCase()) {
            case ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" -> extension.toLowerCase();
            default -> ".jpg"; // forcer une extension sûre
        };
    }
}