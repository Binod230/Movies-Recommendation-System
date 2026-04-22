//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.model

import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonManagedReference
import org.example.moviehubbackend.entity.Review
import org.example.moviehubbackend.entity.Favorite
import org.example.moviehubbackend.entity.Rating
import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    var password: String?,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: Role = Role.USER,

    // In User.kt
    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonIgnore
    val favorites: List<Favorite> = mutableListOf(),
// Note: Make sure 'Favorite' is the correct name of your entity class

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonIgnore // CRITICAL: prevents React from crashing/infinite loop
    val ratings: List<Rating> = mutableListOf(),

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonIgnore // CRITICAL: prevents React from crashing/infinite loop
    val reviews: List<Review> = mutableListOf()

)
