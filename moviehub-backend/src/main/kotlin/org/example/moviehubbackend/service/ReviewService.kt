//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.service

import jakarta.persistence.EntityNotFoundException
import org.example.moviehubbackend.dto.ReviewResponse
import org.example.moviehubbackend.entity.Review
import org.example.moviehubbackend.repository.MovieRepository
import org.example.moviehubbackend.repository.ReviewRepository
import org.example.moviehubbackend.repository.UserActivityRepository
import org.example.moviehubbackend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val movieRepository: MovieRepository,
    private val userRepository: UserRepository,
    private val activityRepository: UserActivityRepository
) {

    @Transactional
    fun addReview(movieId: Long, email: String, comment: String, rating: Int): ReviewResponse {
        val movie = movieRepository.findById(movieId)
            .orElseThrow { EntityNotFoundException("Movie not found") }
        val user = userRepository.findByEmail(email)
            ?: throw EntityNotFoundException("User not found")

        // 1. Save to the 'reviews' table
        val review = reviewRepository.save(
            Review(comment = comment, rating = rating, movie = movie, user = user)
        )

        // 2. Sync with 'user_activities' table
        val activity = activityRepository.findByUserIdAndMovieId(user.id!!, movieId)
            ?: org.example.moviehubbackend.entity.UserActivity(
                user = user,
                movie = movie,
                isFavorite = false // Default for new records
            )

        // Update the fields from the review
        activity.rating = rating
        activity.isWatched = true
        activity.reviewText = comment //  Save the comment here too!

        activityRepository.save(activity)

        return ReviewResponse(
            id = review.id,
            comment = review.comment,
            rating = review.rating,
            userName = user.name,
            movieTitle = movie.title,
            status = "PENDING",
            createdAt = review.createdAt
        )
    }

    @Transactional
    fun getReviewsByMovie(movieId: Long, currentUserEmail: String?): List<ReviewResponse> {
        val allReviews = reviewRepository.findAllByMovieId(movieId)

        return allReviews.filter { review ->
            // ONLY show if status is exactly "APPROVED"
            // This hides pending reviews from everyone, including the author.
            review.status == "APPROVED"
        }.map { mapToResponse(it) }
    }
    // ... other functions (addReview, getReviewsByMovie) ...


    @Transactional
    fun deleteReview(reviewId: Long) {
        val review = reviewRepository.findById(reviewId)
            .orElseThrow { EntityNotFoundException("Review not found with id: $reviewId") }

        // 1. Find the associated activity to clean it up
        val activity = activityRepository.findByUserIdAndMovieId(review.user.id!!, review.movie.id)
        activity?.let {
            it.reviewText = null
            // Optional: it.rating = null // Uncomment if you want to remove the star rating too
            activityRepository.save(it)
        }

        // 2. Delete the actual review record
        reviewRepository.delete(review)
    }


    private fun mapToResponse(review: Review): ReviewResponse {
        return ReviewResponse(
            id = review.id,
            comment = review.comment,
            rating = review.rating,
            status = review.status, // Make sure your DTO has this!
            userName = review.user.name, // Accesses the name from the User entity
            movieTitle = review.movie.title,
            createdAt = review.createdAt
        )
    }

}