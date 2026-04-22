//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.service

import jakarta.transaction.Transactional
import org.example.moviehubbackend.entity.Favorite
import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.entity.UserActivity
import org.example.moviehubbackend.model.User
import org.example.moviehubbackend.repository.FavoriteRepository
import org.example.moviehubbackend.repository.UserActivityRepository
import org.springframework.stereotype.Service

@Service
class FavoriteService(
    private val favoriteRepository: FavoriteRepository,
    private val activityRepository: UserActivityRepository
) {

    @Transactional
    fun addToFavorites(user: User, movie: Movie) {
        // 1. Maintain the traditional Favorite table
        if (!favoriteRepository.existsByUserAndMovie(user, movie)) {
            favoriteRepository.save(Favorite(user = user, movie = movie))
        }
        // 2. UPSERT LOGIC for UserActivity
        // We search for an existing activity for this specific user and movie
        val existingActivity = activityRepository.findByUserIdAndMovieId(user.id!!, movie.id!!)

        if (existingActivity != null) {
            // UPDATE: User already has a record (maybe they watched it before)
            // We only change the favorite status and leave rating/isWatched as they were
            existingActivity.isFavorite = true
            activityRepository.save(existingActivity)
            println("Updated existing activity for User ${user.id}")
        } else {
            // INSERT: First time this user interacts with this movie
            val newActivity = org.example.moviehubbackend.entity.UserActivity(
                user = user,
                movie = movie,
                isFavorite = true,
                isWatched = false, // Default since they just favorited it
                rating = 0,
                reviewText = null
            )
            activityRepository.save(newActivity)
            println("Inserted new activity for User ${user.id}")
        }
    }

    @Transactional
    fun removeFromFavorites(user: User, movie: Movie) {
        // 1. Remove from Favorite table
        favoriteRepository.findByUserAndMovie(user, movie)?.let {
            favoriteRepository.delete(it)
        }

        // 2. Update UserActivity table
        activityRepository.findByUserIdAndMovieId(user.id!!, movie.id!!)?.let { activity ->
            activity.isFavorite = false
            activityRepository.save(activity)
        }
    }
    fun getUserFavorites(user: User): List<Movie> =
        favoriteRepository
            .findByUser(user)
            .map { it.movie }
}
