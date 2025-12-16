package com.example.mini_erp.security;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
    .requestMatchers("/uploads/**").permitAll()
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

    // Orders
    .requestMatchers("/api/orders").hasRole("ADMIN")
    .requestMatchers("/api/orders/**").hasAnyRole("ADMIN", "USER")

    // Invoices
    .requestMatchers("/api/invoices").hasRole("ADMIN") // liste toutes (GET sans param)
    .requestMatchers("/api/invoices/my").hasAnyRole("USER", "ADMIN")
    .requestMatchers("/api/invoices/**").hasAnyRole("USER", "ADMIN") // tout le reste (create, download, etc.)

    // Autres
    .requestMatchers("/api/dashboard/**").hasRole("ADMIN")
    .requestMatchers("/api/products/upload/**").hasRole("ADMIN")

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
