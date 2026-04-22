//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.dto

data class UserRatedMovieDTO(
    val movieId: Long,
    val title: String,
    val genre: String,
    val userRating: Int,
    val averageRating: Double
)


// DTOs.kt
data class UpdateNameRequest(
    var name: String,
)

data class ChangePasswordRequest(
    var oldPassword: String,
    var newPassword: String
)
