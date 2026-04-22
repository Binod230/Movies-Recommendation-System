//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.service

import org.example.moviehubbackend.dto.UserRatedMovieDTO
import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.entity.Rating
import org.example.moviehubbackend.model.User
import org.example.moviehubbackend.repository.MovieRepository
import org.example.moviehubbackend.repository.RatingRepository
import org.springframework.stereotype.Service

@Service
class RatingService(
    private val ratingRepository: RatingRepository,
    private val movieRepository: MovieRepository
) {

    fun rateMovie(user: User, movie: Movie, value: Int) {

        require(value in 1..5) { "Rating must be between 1 and 5" }

        val existingRating =
            ratingRepository.findByUserAndMovie(user, movie)

        val ratingToSave = existingRating?.copy(
            rating = value
        ) ?: Rating(
            user = user,
            movie = movie,
            rating = value
        )

        ratingRepository.save(ratingToSave)

        updateMovieAverage(movie)
    }

    private fun updateMovieAverage(movie: Movie) {

        val ratings = ratingRepository.findAllByMovie(movie)

        val average = if (ratings.isEmpty()) {
            0.0
        } else {
            ratings.map { it.rating }.average()
        }

        movieRepository.save(
            movie.copy(averageRating = average)
        )
    }

    fun getUserRatedMovies(user: User): List<UserRatedMovieDTO> {

        return ratingRepository
            .findAllByUserWithMovie(user)
            .map {
                UserRatedMovieDTO(
                    movieId = it.movie.id!!,
                    title = it.movie.title,
                    genre = it.movie.genre,
                    userRating = it.rating,
                    averageRating = it.movie.averageRating
                )
            }
    }
}
