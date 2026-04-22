//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.example.moviehubbackend.dto.ReviewRequest
import org.example.moviehubbackend.dto.ReviewResponse
import org.example.moviehubbackend.repository.ReviewRepository
import org.example.moviehubbackend.service.ReviewService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/reviews")
class ReviewController(
    private val reviewService: ReviewService,
    private val reviewRepository: ReviewRepository
) {

    // 🔐 AUTH REQUIRED
    @PostMapping("/{movieId}")
    fun addReview(
        @PathVariable movieId: Long,
        @RequestBody request: ReviewRequest,
        authentication: Authentication
    ): ResponseEntity<ReviewResponse> {
        val email = authentication.name
        return ResponseEntity.ok(
            reviewService.addReview(movieId, email, request.comment, request.rating)
        )
    }


    @GetMapping("/pending")
    fun getPendingReviews(): ResponseEntity<List<ReviewResponse>> {
        val pendingReviews = reviewRepository.findAll()
            .filter { it.status == "PENDING" }
            .map { review ->
                ReviewResponse(
                    id = review.id,
                    comment = review.comment,
                    rating = review.rating,
                    status = review.status,
                    userName = review.user.name,
                    movieTitle = review.movie.title,
                    createdAt = review.createdAt
                )
            }
        return ResponseEntity.ok(pendingReviews)
    }

    // In ReviewController.kt (or your Admin Controller)

    @DeleteMapping("/{id}")
    fun deleteReview(@PathVariable id: Long): ResponseEntity<Any> {
        reviewService.deleteReview(id)
        return ResponseEntity.ok(mapOf("status" to "success", "message" to "Review deleted"))
    }

    @PutMapping("/{id}/approve")
    fun approveReview(@PathVariable id: Long): ResponseEntity<Any> {
        val review = reviewRepository.findById(id).orElseThrow()
        val approvedReview = review.copy(status = "APPROVED")
        reviewRepository.save(approvedReview)
        return ResponseEntity.ok(mapOf("message" to "Review approved"))
    }


    // 🌍 PUBLIC
    // 🌍 PUBLIC (with conditional visibility for PENDING reviews)

    @GetMapping("/movie/{movieId}")
    fun getReviews(
        @PathVariable movieId: Long,
        authentication: Authentication? // Spring fills this if the user is logged in
    ): ResponseEntity<List<ReviewResponse>> {
        val email = authentication?.name // This will be null if user is guest
        return ResponseEntity.ok(reviewService.getReviewsByMovie(movieId, email))
    }
}


