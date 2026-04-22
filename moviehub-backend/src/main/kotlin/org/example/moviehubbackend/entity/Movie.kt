//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.entity

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "movies")
data class Movie(


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false)
    val title: String,

    @Column(length = 1000)
    val description: String,

    val genre: String,

    val releaseYear: Int,

    val posterUrl: String? = null,

    val trailerUrl: String? = null,

    @Column(length = 1000)
    val videoUrl: String,

    @Column(nullable = false)
    val averageRating: Double = 0.0,


    val createdAt: LocalDateTime = LocalDateTime.now(),

    // @JsonManagedReference allows the reviews to be serialized in the JSON
    @OneToMany(mappedBy = "movie", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    @JsonManagedReference
    val reviews: List<Review> = mutableListOf()


)
