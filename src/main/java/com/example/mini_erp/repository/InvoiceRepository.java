package com.example.mini_erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mini_erp.model.Invoice;
import com.example.mini_erp.model.User;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
List<Invoice> findByOrderUser(User user);

}
