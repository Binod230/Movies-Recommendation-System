//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.service

import jakarta.transaction.Transactional
import org.example.moviehubbackend.dto.RegisterRequest
import org.example.moviehubbackend.model.Role
import org.example.moviehubbackend.model.User
import org.example.moviehubbackend.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService {

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var passwordEncoder: PasswordEncoder

    fun registerUser(request: RegisterRequest) {

        val role = if (request.email == "admin@gmail.com") {
            Role.ADMIN
        } else {
            Role.USER
        }

        val user = User(
            name = request.name,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            role = Role.USER
        )

        userRepository.save(user)
    }


    fun existsByEmail(email: String): Boolean =
        userRepository.existsByEmail(email)

    fun findByEmail(email: String): User? =
        userRepository.findByEmail(email)


    @Transactional
    fun updateUserName(email: String, newName: String) {
        val user = userRepository.findByEmail(email) ?: throw Exception("User not found")
        user.name = newName
        userRepository.save(user)
    }

    @Transactional
    fun updatePassword(user: User, newPassword: String) {
        user.password = passwordEncoder.encode(newPassword)
        userRepository.save(user)
    }


}
