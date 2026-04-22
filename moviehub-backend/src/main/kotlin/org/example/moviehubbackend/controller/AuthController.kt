//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.example.moviehubbackend.dto.LoginRequest
import org.example.moviehubbackend.dto.LoginResponse
import org.example.moviehubbackend.dto.RegisterRequest
import org.example.moviehubbackend.security.JwtService
import org.example.moviehubbackend.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userService: UserService,
    private val authenticationManager: AuthenticationManager,
    private val jwtService: JwtService
) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<String> {
        if (userService.existsByEmail(request.email)) {
            return ResponseEntity.badRequest().body("Email already exists")
        }

        userService.registerUser(request)
        return ResponseEntity.ok("User registered successfully")
    }




    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {

        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                request.email,
                request.password
            )
        )

        // This fetches the user from DB (with the updated name "Hari")
        val user = userService.findByEmail(request.email!!)
            ?: return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(LoginResponse("", "User not found"))

        val token = jwtService.generateToken(user.email, user.role.name)

        // 🔥 THE FIX: Return the name and role in the response
        return ResponseEntity.ok(
            LoginResponse(
                token = token,
                message = "Login successful",
                userName = user.name, // Pass the DB name here
                role = user.role.name
            )
        )
    }
}

