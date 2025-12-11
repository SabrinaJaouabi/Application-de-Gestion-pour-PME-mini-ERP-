package com.example.mini_erp.security;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- correct
            .csrf(AbstractHttpConfigurer::disable)
          .authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    // .requestMatchers("/api/products").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER")
    // .requestMatchers("/api/products/**").hasAuthority("ROLE_ADMIN")
    // Commandes
    .requestMatchers("/api/orders/user/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER")
    .requestMatchers("/api/orders").hasAuthority("ROLE_ADMIN")
    .requestMatchers("/api/orders/*").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER")
    .requestMatchers("/api/invoices/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
    .requestMatchers("/api/invoices").hasAuthority("ROLE_ADMIN")
    .requestMatchers("/api/dashboard/**").hasAuthority("ROLE_ADMIN")
    .anyRequest().authenticated()
)
            .addFilterBefore(jwtFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
   @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
