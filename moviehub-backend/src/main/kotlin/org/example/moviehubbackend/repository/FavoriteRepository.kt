//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.repository

import org.example.moviehubbackend.entity.Favorite
import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.model.User
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.JpaRepository

interface FavoriteRepository : JpaRepository<Favorite, Long> {


    fun findByUser(user: User): List<Favorite>

    fun findByUserAndMovie(user: User, movie: Movie): Favorite?

    fun existsByUserAndMovie(user: User, movie: Movie): Boolean

    fun existsByMovieId(movieId: Long): Boolean

}
