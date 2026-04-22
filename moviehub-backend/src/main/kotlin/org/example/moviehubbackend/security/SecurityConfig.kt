//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthenticationFilter
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http

            .cors { it.configurationSource(corsConfigurationSource()) } // Explicitly point to CORS source
            .csrf { it.disable() }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests { auth ->

                auth.requestMatchers(HttpMethod.DELETE, "/api/movies/**")
                    .hasAnyAuthority("ADMIN", "ROLE_ADMIN") //
                // Preflight
                auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Auth
                auth.requestMatchers("/api/auth/**").permitAll()

                auth.requestMatchers("/api/admin/**").permitAll()
                auth.requestMatchers(HttpMethod.DELETE, "/admin/**").hasAuthority("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")                // Public GET APIs
                auth.requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()

                auth.requestMatchers(HttpMethod.GET, "/api/recommendations/userbase-recommendations/**").permitAll()


                auth.requestMatchers("/notifications/**").permitAll() //
                auth.requestMatchers("/ws-soap/**").permitAll()
                auth.requestMatchers(HttpMethod.PUT, "/api/users/**").authenticated()
                auth.requestMatchers("/api/recommendations/**").authenticated() // Require login here
                // Reviews - USER & ADMIN can POST
                auth.requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated()
                auth.requestMatchers(HttpMethod.GET, "/api/reviews/movie/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/favorites/**").permitAll()
                auth.requestMatchers(HttpMethod.POST, "/api/favorites/**").permitAll()
                auth.requestMatchers("/api/recommendations/**").authenticated() // Require login here

                // Movies - ADMIN only
                auth.requestMatchers(HttpMethod.POST, "/api/movies/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                auth.requestMatchers(HttpMethod.PUT, "/api/movies/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                // Change this line in SecurityConfig.kt
                auth.requestMatchers(HttpMethod.PATCH, "/api/admin/users/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN", "USER", "ROLE_USER")
                // Admin APIs

                // Everything else requires login
                auth.anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationManager(
        config: AuthenticationConfiguration
    ): AuthenticationManager = config.authenticationManager

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:5173")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

}
