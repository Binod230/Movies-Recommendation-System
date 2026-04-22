//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.repository

import org.example.moviehubbackend.entity.UserActivity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface UserActivityRepository : JpaRepository<UserActivity, Long> {

    @Query("SELECT ua FROM UserActivity ua WHERE ua.user.id = :userId")
    fun findByUserId(userId: Long): List<UserActivity>

    fun deleteByUserId(userId: Long)
    fun findByUserIdAndMovieId(userId: Long, movieId: Long): UserActivity?
}