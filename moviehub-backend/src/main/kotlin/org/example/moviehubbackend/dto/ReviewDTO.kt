//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.dto

import java.time.LocalDateTime

data class ReviewResponse(
    val id: Long,
    val comment: String,
    val rating: Int,
    val userName: String,
    val status: String, // Add this
    val movieTitle: String, // 👈 ADD THIS FIELD
    val createdAt: LocalDateTime
)