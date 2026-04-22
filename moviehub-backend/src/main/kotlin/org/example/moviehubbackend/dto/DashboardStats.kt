//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.dto
data class DashboardStats(
    val totalMovies: Long,
    val activeUsers: Long,
    val revenue: Double,
    val pendingReviews: Long
)