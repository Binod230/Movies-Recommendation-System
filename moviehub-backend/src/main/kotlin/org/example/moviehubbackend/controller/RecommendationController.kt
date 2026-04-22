//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.service.RecommendationService
import org.example.moviehubbackend.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.example.moviehubbackend.security.UserPrincipal

@RestController
@RequestMapping("/api/recommendations")
class RecommendationController(
    private val recommendationService: RecommendationService,
    private val userService: UserService
    // ✅ Removed 'private val email: EmailValidator' to fix the startup error
) {

    @GetMapping
    fun recommend(authentication: Authentication): Any {
        val email = authentication.name
        val user = userService.findByEmail(email)!!
        return recommendationService.recommendMovies(user)
    }

    @GetMapping("/genre")
    fun recommendByGenre(authentication: Authentication): List<Movie> {
        val email = authentication.name
        val user = userService.findByEmail(email)!!
        return recommendationService.recommendByGenre(user)
    }

    @GetMapping("/userbase-recommendations")
    fun getPersonalizedRecs(@AuthenticationPrincipal principal: Any): ResponseEntity<List<Movie>> {
        //  This cast resolves the 'id' reference error by mapping 'Any' to your custom 'UserPrincipal'
        val user = principal as? UserPrincipal
            ?: return ResponseEntity.status(401).build()

        val movies = recommendationService.getRecommendationsForUser(user.id)
        return ResponseEntity.ok(movies)
    }
}