//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import org.example.moviehubbackend.model.User
import java.time.LocalDateTime

@Entity
@Table(name = "reviews")
data class Review(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 500)
    val comment: String,

    @Column(nullable = false)
    val rating: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    val movie: Movie,


    @Column(nullable = false)
    val status: String = "PENDING",


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    val user: User,

    val createdAt: LocalDateTime = LocalDateTime.now(),



    // In Review.kt


)