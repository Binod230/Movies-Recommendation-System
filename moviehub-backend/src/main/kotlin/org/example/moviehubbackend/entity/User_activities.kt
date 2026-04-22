//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.entity

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.example.moviehubbackend.model.User

@Entity
@Table(name = "user_activities")
 data class UserActivity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    val movie: Movie,

    var rating: Int? = null,      // 1-5
    var isFavorite: Boolean = false,
    var isWatched: Boolean = false,
    var reviewText: String? = null
)