//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class RegisterRequest(

    @field:NotBlank(message = "Name is required")
    val name: String,

    @field:Email(message = "Invalid email")
    @field:NotBlank(message = "Email is required")
    val email: String,

    @field:NotBlank(message = "Password is required")
    val password: String
)
