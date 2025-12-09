package com.example.mini_erp.security;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products").hasAnyRole("ADMIN","USER")
                .requestMatchers("/api/products/**").hasRole("ADMIN")
                  // Commandes
             .requestMatchers("/api/orders/user/**").hasAnyRole("ADMIN","USER")

            .requestMatchers("/api/orders").hasRole("ADMIN")
            .requestMatchers("/api/orders/*").hasAnyRole("ADMIN","USER")
                    .requestMatchers("/api/invoices/**").hasAnyRole("USER","ADMIN") // Facture pour USER/ADMIN
            .requestMatchers("/api/invoices").hasRole("ADMIN")                  // GET all invoices
                        .requestMatchers("/api/dashboard/**").hasRole("ADMIN") // <-- dashboard sécurisé pour ADMIN


                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
