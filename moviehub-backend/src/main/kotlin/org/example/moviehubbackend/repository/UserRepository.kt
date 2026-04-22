//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.repository

import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.entity.Rating
import org.example.moviehubbackend.model.User

import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {

    fun findByEmail(email: String): User?

    fun existsByEmail(email: String): Boolean

}



