//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.dto

import org.springframework.boot.context.properties.ConfigurationPropertiesBindingPostProcessor

data class MovieDetailsResponseDTO(
    val id: Long,
    val title: String,
    val genre: String,
    val description: String?,
    val averageRating: Double,
    val posterUrl: String?,
    val trailerUrl: String?,
    val videoUrl: String?,
    val userRating: Int? ,
    val reviews: List<ReviewResponse> = emptyList()
)
