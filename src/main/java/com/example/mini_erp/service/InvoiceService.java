package com.example.mini_erp.service;

import com.example.mini_erp.model.Invoice;
import com.example.mini_erp.model.Order;
import com.example.mini_erp.model.OrderItem;
import com.example.mini_erp.repository.InvoiceRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    /**
     * Générer le PDF de la facture en bytes
     */
    public byte[] generateInvoicePdf(Order order) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Titre
            document.add(new Paragraph("FACTURE")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(20));

            // Informations commande
            document.add(new Paragraph("Commande ID: " + order.getId()));
            document.add(new Paragraph("Utilisateur: " + order.getUser().getFullName()));
            document.add(new Paragraph("Date: " + order.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
            document.add(new Paragraph("\n"));

            // Table des produits
            Table table = new Table(new float[]{4, 1, 2, 2});
            table.addHeaderCell("Produit");
            table.addHeaderCell("Quantité");
            table.addHeaderCell("Prix Unitaire");
            table.addHeaderCell("Total");

            BigDecimal totalAmount = BigDecimal.ZERO;

            for (OrderItem item : order.getItems()) {
                table.addCell(item.getProduct().getName());
                table.addCell(item.getQuantity().toString());
                table.addCell(item.getProduct().getPrice().toString());
                BigDecimal itemTotal = item.getProduct().getPrice()
                        .multiply(new BigDecimal(item.getQuantity()));
                table.addCell(itemTotal.toString());
                totalAmount = totalAmount.add(itemTotal);
            }

            document.add(table);
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Montant Total: " + totalAmount));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Générer et sauvegarder la facture
     */
    public Invoice generateAndSaveInvoice(Order order) throws Exception {
        byte[] pdfBytes = generateInvoicePdf(order);

        String fileName = "facture_" + order.getId() + ".pdf";
        Path path = Paths.get("invoices/" + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, pdfBytes);

        Invoice invoice = Invoice.builder()
                .order(order)
                .createdAt(order.getOrderDate())
                .fileName(fileName)
                .build();

        return invoiceRepository.save(invoice);
    }

    /**
     * Récupérer le PDF d’une facture existante
     */
    public byte[] getInvoicePdf(String fileName) throws Exception {
        Path path = Paths.get("invoices/" + fileName);
        return Files.readAllBytes(path);
    }

    /**
     * Lister toutes les factures
     */
    public java.util.List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
}
