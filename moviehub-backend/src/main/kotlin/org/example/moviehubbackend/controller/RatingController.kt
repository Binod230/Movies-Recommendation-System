//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.example.moviehubbackend.repository.MovieRepository
import org.example.moviehubbackend.service.RatingService
import org.example.moviehubbackend.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/ratings")
class RatingController(
    private val ratingService: RatingService,
    private val userService: UserService,
    private val movieRepository: MovieRepository
) {

    @PostMapping("/{movieId}")
    fun rateMovie(
        @PathVariable movieId: Long,
        @RequestParam rating: Int,
        authentication: Authentication
    ): ResponseEntity<String> {

        if (rating !in 1..5) {
            return ResponseEntity.badRequest()
                .body("Rating must be between 1 and 5")
        }

        val user = userService.findByEmail(authentication.name)
            ?: return ResponseEntity.badRequest()
                .body("User not found")

        val movie = movieRepository.findById(movieId)
            .orElseThrow { RuntimeException("Movie not found") }

        ratingService.rateMovie(user, movie, rating)

        return ResponseEntity.ok("Rating submitted successfully")
    }

    @GetMapping("/my")
    fun myRatedMovies(authentication: Authentication): ResponseEntity<Any> {

        val user = userService.findByEmail(authentication.name)
            ?: return ResponseEntity.badRequest().body("User not found")

        return ResponseEntity.ok(
            ratingService.getUserRatedMovies(user)
        )
    }
}
