package com.dormitory.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/ai-chat/**"
                        ).hasAnyRole("STUDENT", "MANAGER", "ADMIN")

                        .requestMatchers(
                                "/api/auth/**",
                                "/ws/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/access/scan"
                        ).hasAnyRole("STUDENT", "MANAGER", "ADMIN")

                        .requestMatchers(
                                "/api/access/my-history"
                        ).hasRole("STUDENT")

                        .requestMatchers(
                                "/api/access/logs"
                        ).hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(
                                "/api/student/**",
                                "/api/ai-chat/**",
                                "/api/payments/my",
                                "/api/applications/my",
                                "/api/complaints/my",
                                "/api/notifications/my",
                                "/api/notifications/unread-count",
                                "/api/users/me",
                                "/api/users/me/roommates"
                        ).hasRole("STUDENT")

                        .requestMatchers(HttpMethod.POST, "/api/applications")
                        .hasRole("STUDENT")

                        .requestMatchers(HttpMethod.POST, "/api/complaints")
                        .hasRole("STUDENT")

                        .requestMatchers(
                                "/api/manager/**",
                                "/api/applications/**",
                                "/api/complaints/**",
                                "/api/payments/**",
                                "/api/chats/**",
                                "/api/notifications/**",
                                "/api/rooms/**",
                                "/api/users/students",
                                "/api/users/managers"
                        ).hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(
                                "/api/admin/**",
                                "/api/users/admins"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/me",
                                "/api/users/me/roommates"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/users/me"
                        ).authenticated()

                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000"
        ));

        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}