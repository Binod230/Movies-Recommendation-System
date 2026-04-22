//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.repository

import jakarta.transaction.Transactional
import org.example.moviehubbackend.entity.Review
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface ReviewRepository : JpaRepository<Review, Long> {

    fun existsByMovieId(movieId: Long): Boolean

    fun findAllByMovieId(movieId: Long): List<Review>


    @Modifying
    @Transactional
    @Query("DELETE FROM Review r WHERE r.user.id = :userId")
    fun deleteByUserId(userId: Long)
}