//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.dto

data class MovieResponseDTO(
    val id: Long,
    val title: String,
    val genre: String,
    val description: String?,
    val averageRating: Double,
    val posterUrl: String?,
    val trailerUrl: String?,
    val videoUrl: String?,
    val userRating :Int?,
)

