package com.example.mini_erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mini_erp.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

}
