//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.entity

import jakarta.persistence.*
import org.example.moviehubbackend.model.User

@Entity
@Table(
    name = "favorites",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["user_id", "movie_id"])
    ]
)
data class Favorite(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    val movie: Movie
)
