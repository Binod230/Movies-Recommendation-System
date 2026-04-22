//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.repository.MovieRepository
import org.example.moviehubbackend.service.FavoriteService
import org.example.moviehubbackend.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/favorites")
class FavoriteController(
    private val favoriteService: FavoriteService,
    private val userService: UserService,
    private val movieRepository: MovieRepository
) {

    @PostMapping("/{movieId}")
    fun addFavorite(
        @PathVariable movieId: Long,
        authentication: Authentication
    ): ResponseEntity<String> {

        val user = userService.findByEmail(authentication.name)
            ?: return ResponseEntity.badRequest().body("User not found")

        val movie = movieRepository.findById(movieId)
            .orElseThrow { RuntimeException("Movie not found") }

        favoriteService.addToFavorites(user, movie)
        return ResponseEntity.ok("Added to favorites")
    }

    @DeleteMapping("/{movieId}")
    fun removeFavorite(
        @PathVariable movieId: Long,
        authentication: Authentication
    ): ResponseEntity<String> {

        val user = userService.findByEmail(authentication.name)
            ?: return ResponseEntity.badRequest().body("User not found")

        val movie = movieRepository.findById(movieId)
            .orElseThrow { RuntimeException("Movie not found") }

        favoriteService.removeFromFavorites(user, movie)
        return ResponseEntity.ok("Removed from favorites")
    }

    @GetMapping
    fun getFavorites(authentication: Authentication): List<Movie> {

        val user = userService.findByEmail(authentication.name)
            ?: throw RuntimeException("User not found")

        return favoriteService.getUserFavorites(user)
    }
}
