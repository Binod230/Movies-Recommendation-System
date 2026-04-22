//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.service

import org.example.moviehubbackend.entity.Movie
import org.example.moviehubbackend.model.User
import org.example.moviehubbackend.repository.MovieRepository
import org.example.moviehubbackend.repository.RatingRepository
import org.example.moviehubbackend.repository.UserActivityRepository
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class RecommendationService(
    private val movieRepository: MovieRepository,
    private val ratingRepository: RatingRepository,
    private val activityRepository: UserActivityRepository
) {

    fun recommendMovies(user: User): List<Movie> {

        val ratedMovieIds = ratingRepository
            .findByUser(user)
            .mapNotNull { it.movie.id }
            .toSet()

        return movieRepository
            .findAllByOrderByAverageRatingDesc()
            .filter { it.id !in ratedMovieIds }
            .take(10)
    }

//     * Recommend movies based on user's favorite genre
    fun recommendByGenre(user: User): List<Movie> {

        val ratedMovieIds = ratingRepository
            .findByUser(user)
            .mapNotNull { it.movie.id }
            .toSet()

        val genresRatedByUser = ratingRepository.findGenresRatedByUser(user)

        // If user has no genre history → fallback to top-rated movies
        if (genresRatedByUser.isEmpty()) {
            return movieRepository
                .findAllByOrderByAverageRatingDesc()
                .filter { it.id !in ratedMovieIds }
                .take(10)
        }

        // Find most frequently rated genre
        val favoriteGenre = genresRatedByUser
            .groupingBy { it }
            .eachCount()
            .maxBy { it.value }
            .key

        return movieRepository
            .findByGenreOrderByAverageRatingDesc(favoriteGenre)
            .filter { it.id !in ratedMovieIds }
            .take(10)
    }

//    Recommend movies based on user activities
fun getRecommendationsForUser(userId: Long): List<Movie> {
    val activities = activityRepository.findByUserId(userId)

    // 1. Get the list of IDs the user has already seen
    val watchedIds = activities.map { it.movie.id!! }

    // 2. Get preferred genres
    val topGenres = activities.filter { it.rating!! >= 4 || it.isFavorite }
        .map { it.movie.genre }
        .distinct()

    // 3. Try to find personalized matches
    var recommendations = movieRepository.findRecommendations(topGenres, watchedIds, PageRequest.of(0, 10))

    // 4. THE FALLBACK: If personalized list is empty, show Top Rated movies they haven't seen
    if (recommendations.isEmpty()) {
        recommendations = movieRepository.findAllByOrderByAverageRatingDesc()
            .filter { !watchedIds.contains(it.id) } // Don't show what they just watched
            .take(10)
    }

    return recommendations
}
}
