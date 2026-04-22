//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.repository

import jakarta.transaction.Transactional
import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.entity.Rating
import org.example.moviehubbackend.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface RatingRepository : JpaRepository<Rating, Long> {

    fun findByUserAndMovie(user: User, movie: Movie?): Rating?

    fun findByUserAndMovieId(user: User, movieId: Long): Rating?

    fun findAllByMovie(movie: Movie): List<Rating>

    fun findByUser(user: User): List<Rating>

    fun countByMovie(movie: Movie):Int
    @Query("""
        SELECT r.movie.genre
        FROM Rating r
        WHERE r.user = :user
    """)
    fun findGenresRatedByUser(user: User): List<String>

    @Query("""
    SELECT r
    FROM Rating r
    JOIN FETCH r.movie
    WHERE r.user = :user
""")
    fun findAllByUserWithMovie(user: User): List<Rating>

    @Modifying
    @Transactional
    @Query("DELETE FROM Rating r WHERE r.user.id = :userId")
    fun deleteByUserId(userId: Long)

}