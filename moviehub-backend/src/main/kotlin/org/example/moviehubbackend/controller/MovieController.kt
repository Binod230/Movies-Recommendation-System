//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.example.moviehubbackend.dto.MovieDetailsResponseDTO
import org.example.moviehubbackend.dto.MovieResponseDTO
import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.mapper.MovieMapper
import org.example.moviehubbackend.repository.MovieRepository
import org.example.moviehubbackend.repository.RatingRepository
import org.example.moviehubbackend.service.MovieService
import org.example.moviehubbackend.service.UserService
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.example.moviehubbackend.soap.GetTotalMoviesResponse
@RestController
@RequestMapping("/api/movies")
class MovieController(
    private val movieService: MovieService,
    private val movieRepository: MovieRepository,
    private val userService: UserService,
    private val ratingRepository: RatingRepository
) {

    // ✅ ADD MOVIE (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    fun addMovie(@RequestBody movie: Movie): Movie =
        movieService.addMovie(movie)


    // ✅ GET ALL
    @GetMapping("/all")
    fun getAllMovies(): List<Movie> =
        movieService.getAllMovies()

    @GetMapping("/top-rated")
    fun getTopRatedMovies(): List<Movie> {
        return movieService.getTopRatedMovies()
    }

    @GetMapping("/stats/soap-count")
    fun getSoapCount(): ResponseEntity<Int> {
        // This calls your internal SOAP logic
        val count = movieRepository.count().toInt()
        return ResponseEntity.ok(count)
    }


    // ✅ PAGINATED
    @GetMapping
    fun getMovies(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "1000") size: Int
    ): Page<Movie> =
        movieRepository.findAll(PageRequest.of(page, size))

    // ✅ GET BY ID (with user rating)
    @GetMapping("/{id}")
    fun getMovieById(
        @PathVariable id: Long,
        authentication: Authentication?
    ): ResponseEntity<MovieResponseDTO> {

        val movie = movieService.getMovieById(id)

        val user = authentication?.name?.let {
            userService.findByEmail(it)
        }

        val dto = MovieMapper.toDTO(movie, user, ratingRepository)
        return ResponseEntity.ok(dto)
    }

//    // ✅ UPDATE (ADMIN)
//    @PreAuthorize("hasRole('ADMIN')")
//    @PutMapping("/{id}")
//    fun updateMovie(
//        @PathVariable id: Long,
//        @RequestBody updatedMovie: Movie
//    ): ResponseEntity<Movie> =
//        ResponseEntity.ok(movieService.updateMovie(id, updatedMovie))
//
//    // ✅ DELETE (ADMIN)
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/{id}")
//    fun deleteMovie(@PathVariable id: Long): ResponseEntity<String> {
//        movieService.deleteMovie(id)
//        return ResponseEntity.ok("Movie deleted successfully")
//    }


//    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    fun updateMovie(
        @PathVariable id: Long,
        @RequestBody updatedMovie: Movie
    ): ResponseEntity<Movie> {
        return ResponseEntity.ok(movieService.updateMovie(id, updatedMovie))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun deleteMovie(@PathVariable id: Long): ResponseEntity<Map<String, String>> {
        movieService.deleteMovie(id)
        return ResponseEntity.ok(mapOf("message" to "Movie deleted successfully"))
    }

    // ✅ MOVIE DETAILS (login optional)
    @GetMapping("/{id}/details")
    fun getMovieDetails(
        @PathVariable id: Long,
        authentication: Authentication?
    ): ResponseEntity<MovieDetailsResponseDTO> {

        val user = authentication?.name?.let {
            userService.findByEmail(it)
        }

        return ResponseEntity.ok(
            movieService.getMovieDetails(id, user)
        )
    }

    // 🎯 SIMILAR MOVIES (Same genre, excluding current movie)
    @GetMapping("/{id}/similar")
    fun getSimilarMovies(
        @PathVariable id: Long
    ): ResponseEntity<List<MovieResponseDTO>> {

        val movies = movieService.getSimilarMovies(id)

        val response = movies.map {
            MovieResponseDTO(
                id = it.id!!,
                title = it.title,
                genre = it.genre,
                description = it.description,
                averageRating = it.averageRating,
                posterUrl = it.posterUrl,
                trailerUrl = it.trailerUrl,
                videoUrl = it.videoUrl,
                userRating = null
            )
        }

        return ResponseEntity.ok(response)
    }


    // 🔍 SEARCH
    @GetMapping("/search")
    fun searchMovies(
        @RequestParam keyword: String
    ) = movieService.searchMovies(keyword)

    // 🎭 FILTER
    @GetMapping("/filter")
    fun filterByGenre(
        @RequestParam genre: String
    ) = movieService.filterByGenre(genre)

    // 🔍 + 🎭 SEARCH + FILTER
    @GetMapping("/search-filter")
    fun searchAndFilter(
        @RequestParam keyword: String,
        @RequestParam genre: String
    ) = movieService.searchAndFilter(keyword, genre)
}
