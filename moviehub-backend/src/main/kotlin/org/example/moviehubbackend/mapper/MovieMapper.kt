//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.mapper

import org.example.moviehubbackend.dto.MovieDetailsResponseDTO
import org.example.moviehubbackend.dto.MovieResponseDTO
import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.model.User
import org.example.moviehubbackend.repository.RatingRepository

object MovieMapper {

    fun toDTO(
        movie: Movie,
        user: User?,
        ratingRepository: RatingRepository
    ): MovieResponseDTO {

        val userRating = user?.let {
            ratingRepository
                .findByUserAndMovieId(it, movie.id!!)
                ?.rating
        }

        return MovieResponseDTO(
            id = movie.id!!,
            title = movie.title,
            genre = movie.genre,
            description = movie.description,
            averageRating = movie.averageRating,
            posterUrl = movie.posterUrl,
            trailerUrl = movie.trailerUrl,
            videoUrl = movie.videoUrl,
            userRating = userRating
        )
    }

    fun toDetailsDTO(
        movie: Movie,
        userRating: Int?
    ): MovieDetailsResponseDTO =
        MovieDetailsResponseDTO(
            id = movie.id!!,
            title = movie.title,
            genre = movie.genre,
            description = movie.description,
            averageRating = movie.averageRating,
            posterUrl = movie.posterUrl,
            trailerUrl = movie.trailerUrl,
            videoUrl = movie.videoUrl,
            userRating = userRating
        )
}
