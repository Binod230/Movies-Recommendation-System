//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.dto

data class LoginResponse(
    val token: String,
    val message: String,
    val userName: String? = null, // Add this
    val role: String? = null
)
