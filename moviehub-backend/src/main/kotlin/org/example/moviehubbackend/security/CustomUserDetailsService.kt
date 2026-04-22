//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.security

import org.example.moviehubbackend.repository.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails {
        val user = userRepository.findByEmail(email)
            ?: throw UsernameNotFoundException("User not found with email: $email")

        val authorities = listOf(SimpleGrantedAuthority(user.role.toString()))

        return UserPrincipal(
            id = user.id!!,
            email = user.email,
            pass = user.password,
            authorities = authorities
        )
    }
}