package com.example.mini_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mini_erp.model.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>{

}
