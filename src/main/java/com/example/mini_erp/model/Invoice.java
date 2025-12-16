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


    private LocalDateTime createdAt;

    private String fileName; // nom du PDF
@OneToOne
@JoinColumn(name = "order_id")
private Order order;

}
