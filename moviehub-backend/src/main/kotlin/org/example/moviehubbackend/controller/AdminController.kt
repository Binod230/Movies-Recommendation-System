        //SUBEDI RABIN M25W0465
        package org.example.moviehubbackend.controller

        import jakarta.transaction.Transactional
        import org.example.moviehubbackend.admin.DashboardStats
        import org.example.moviehubbackend.model.Role
        import org.example.moviehubbackend.repository.MovieRepository
        import org.example.moviehubbackend.repository.RatingRepository
        import org.example.moviehubbackend.repository.ReviewRepository
        import org.example.moviehubbackend.repository.UserRepository
        import org.springframework.http.ResponseEntity
        import org.springframework.security.access.prepost.PreAuthorize
        import org.springframework.web.bind.annotation.*
        import org.springframework.web.bind.annotation.*
        import com.fasterxml.jackson.annotation.JsonIgnore
        import org.example.moviehubbackend.repository.UserActivityRepository


        @RestController
        @RequestMapping("api/admin")
        @CrossOrigin(
            origins = ["http://localhost:5173"],
            allowCredentials = "true",
            allowedHeaders = ["*"],
            methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS]
        )
        class AdminController(
            private val movieRepo: MovieRepository,
            private val userRepo: UserRepository,
            private val reviewRepo: ReviewRepository,
            private val reviewRepository: ReviewRepository,
            private val userRepository: UserRepository,
            private val ratingRepository: RatingRepository,
            private val userActivityRepository: UserActivityRepository
        ) {

            @GetMapping("/dashboard/stats")
            fun getDashboardStats(): DashboardStats {
                return DashboardStats(
                    totalMovies = movieRepo.count(),
                    totalUsers = userRepo.count(),
                    totalReviews = reviewRepo.count()
                )
            }

            @GetMapping("/movies/recent")
            fun getRecentMovies() =
                movieRepo.findTop5ByOrderByCreatedAtDesc()


            // 1. Fetch all users
            @GetMapping("/users")
            fun getAllUsers() = userRepo.findAll()

            @DeleteMapping("/users/{id}")
            @Transactional // This ensures if one delete fails, none of them happen
            fun deleteUser(@PathVariable id: Long): ResponseEntity<Any> {
                return try {
                    if (!userRepository.existsById(id)) {
                        return ResponseEntity.status(404).body(mapOf("message" to "User not found"))
                    }

                    // 1. Delete dependent data first to satisfy Foreign Key constraints
                    // Assuming you have these repositories injected in the controller
                    userActivityRepository.deleteByUserId(id)
                    reviewRepository.deleteByUserId(id)

                    // 2. Now it is safe to delete the user
                    userRepository.deleteById(id)

                    ResponseEntity.ok().body(mapOf("message" to "User and all associated activity deleted successfully"))
                } catch (e: Exception) {
                    ResponseEntity.status(500).body(mapOf("error" to "Could not delete user: ${e.message}"))
                }
            }



            @PatchMapping("/users/{id}/role")
            fun updateUserRole(
                @PathVariable id: Long,
                @RequestBody updates: Map<String, String>
            ): Map<String, String> {
                println("Received request to change role for user ID: $id") // Debug log

                val user = userRepo.findById(id).orElseThrow {
                    RuntimeException("User not found with id: $id")
                }

                val roleString = updates["role"] ?: throw RuntimeException("Role string is missing")
                println("New role requested: $roleString") // Debug log

                try {
                    // Convert to Enum safely
                    user.role = Role.valueOf(roleString.uppercase())
                    userRepo.save(user)
                    return mapOf("message" to "Success")
                } catch (e: Exception) {
                    println("Error updating role: ${e.message}")
                    throw RuntimeException("Update failed: ${e.message}")
                }
            }
        }