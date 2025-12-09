package com.example.mini_erp.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "invoices")
public class Invoice {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Order order;

    private LocalDateTime createdAt;

    private String fileName; // nom du PDF

}
