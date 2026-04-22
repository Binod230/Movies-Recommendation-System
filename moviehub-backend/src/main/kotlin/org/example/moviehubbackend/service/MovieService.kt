//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.service

import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.example.moviehubbackend.dto.MovieDetailsResponseDTO
import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.exception.ResourceNotFoundException
import org.example.moviehubbackend.model.User
import org.example.moviehubbackend.repository.FavoriteRepository
import org.example.moviehubbackend.repository.MovieRepository
import org.example.moviehubbackend.repository.RatingRepository
import org.example.moviehubbackend.repository.ReviewRepository
import org.example.moviehubbackend.websocket.MovieNotificationHandler
import org.hibernate.query.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
@Service
class MovieService(
    private val movieRepository: MovieRepository,
    private val ratingRepository: RatingRepository,
    private val reviewRepository: ReviewRepository,
    private val favoriteRepository: FavoriteRepository,
    private val notificationHandler: MovieNotificationHandler
) {

    fun addMovie(movie: Movie): Movie {
        // 1. Save to DB first
        val savedMovie = movieRepository.save(movie)
        // 2. Wrap notification in try-catch so it doesn't break the 'Save' action
        try {
            notificationHandler.broadcast(savedMovie.title)
        } catch (e: Exception) {
            println("Notification failed but movie was saved: ${e.message}")
        }
        return savedMovie
    }

    fun getAllMovies(): List<Movie> =
        movieRepository.findAll()

    fun getMovieById(id: Long): Movie =
        movieRepository.findById(id)
            .orElseThrow {
                ResourceNotFoundException("Movie not found with id $id")
            }

    @Transactional
    fun updateMovie(id: Long, updatedMovie: Movie): Movie {
        // No checks for reviews/favorites here - Admin is allowed to update anytime
        val rowsAffected = movieRepository.updateMovieCustom(
            id = id,
            title = updatedMovie.title,
            description = updatedMovie.description,
            genre = updatedMovie.genre,
            year = updatedMovie.releaseYear,
            poster = updatedMovie.posterUrl,
            trailer = updatedMovie.trailerUrl,
            video = updatedMovie.videoUrl
        )

        if (rowsAffected == 0) {
            throw EntityNotFoundException("Movie not found with id: $id")
        }

        // Return the object with the ID so React can update the UI
        return updatedMovie.apply { this.id = id }
    }


    @Transactional
    fun deleteMovie(id: Long): Boolean {
        // 1. Wipe everything connected to the movie first
        movieRepository.deleteRatingsNative(id)
        movieRepository.deleteReviewsNative(id)
        movieRepository.deleteFromFavoritesNative(id)

        //  Clear the activity table so the Foreign Key doesn't block us
        movieRepository.deleteUserActivitiesNative(id)

        // 2. Now delete the movie safely
        val deleted = movieRepository.deleteMovieNative(id)
        return deleted > 0
    }

    @Transactional
    fun getMovieDetails(id: Long, user: User?): MovieDetailsResponseDTO {
        // Force the join fetch
        val movie = movieRepository.findByIdWithReviews(id)
            .orElseThrow { Exception("Movie not found") }

        println("!!! BACKEND CHECK: Movie ${movie.title} has ${movie.reviews.size} reviews !!!")

        return MovieDetailsResponseDTO(
            id = movie.id,
            title = movie.title,
            genre = movie.genre,
            description = movie.description,
            averageRating = movie.averageRating,
            posterUrl = movie.posterUrl,
            trailerUrl = movie.trailerUrl,
            videoUrl = movie.videoUrl,
            userRating = null
        )
    }


    fun getTopRatedMovies(): List<Movie> {
        return movieRepository.findTop10ByOrderByAverageRatingDesc()
    }


    fun getSimilarMovies(movieId: Long): List<Movie> {

        val movie = movieRepository.findById(movieId)
            .orElseThrow { RuntimeException("Movie not found") }

        return movieRepository
            .findByGenre(movie.genre)
            .filter { it.id != movieId }
            .sortedByDescending { it.averageRating }
            .take(6)
    }

    // Search only
    fun searchMovies(keyword: String): List<Movie> =
        movieRepository.findByTitleContainingIgnoreCase(keyword)

    // Filter only
    fun filterByGenre(genre: String): List<Movie> =
        movieRepository.findByGenreIgnoreCase(genre)

    // Search + Filter
    fun searchAndFilter(
        keyword: String,
        genre: String
    ): List<Movie> =
        movieRepository
            .findByTitleContainingIgnoreCaseAndGenreIgnoreCase(
                keyword,
                genre
            )
}
