//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.example.moviehubbackend.dto.ChangePasswordRequest
import org.example.moviehubbackend.dto.UpdateNameRequest
import org.example.moviehubbackend.service.RatingService
import org.example.moviehubbackend.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = ["http://localhost:5173"]) // Add this if missing
class UserController(
    private val ratingService: RatingService,
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder
) {

    @GetMapping("/me")
    fun currentUser(authentication: Authentication): Map<String, Any> {
        return mapOf(
            "email" to authentication.name,
            "roles" to authentication.authorities.map { it.authority }
        )
    }


    @GetMapping("/me/ratings")
    fun getMyRatings(authentication: Authentication) =
        ratingService.getUserRatedMovies(
            userService.findByEmail(authentication.name)!!
        )

    @PutMapping("/update-name")
    fun updateName(@RequestBody request: UpdateNameRequest, principal: Principal): ResponseEntity<String> {
        val email = principal.name
        userService.updateUserName(email, request.name)
        return ResponseEntity.ok("Name updated successfully")
    }

    // Change this line
    @PutMapping("/change-password")
    fun changePassword(@RequestBody request: ChangePasswordRequest, principal: Principal): ResponseEntity<String> {
        val email = principal.name
        val user = userService.findByEmail(email) ?: return ResponseEntity.badRequest().body("User not found")

        if (!passwordEncoder.matches(request.oldPassword, user.password)) {
            return ResponseEntity.badRequest().body("Current password is incorrect")
        }

        userService.updatePassword(user, request.newPassword)
        return ResponseEntity.ok("Password updated successfully")
    }



}
