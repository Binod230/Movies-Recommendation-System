//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.repository

import jakarta.transaction.Transactional
import org.example.moviehubbackend.entity.Movie
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional

interface MovieRepository : JpaRepository<Movie, Long> {
    @Query("SELECT m FROM Movie m LEFT JOIN FETCH m.reviews WHERE m.id = :id")
    fun findByIdWithReviews(@Param("id") id: Long): Optional<Movie>

    @Modifying
    @Transactional
    @Query("""
        UPDATE Movie m 
        SET m.title = :title, 
            m.description = :description, 
            m.genre = :genre,
            m.releaseYear = :year, 
            m.posterUrl = :poster, 
            m.trailerUrl = :trailer, 
            m.videoUrl = :video
        WHERE m.id = :id
    """)
    fun updateMovieCustom(
        @Param("id") id: Long,
        @Param("title") title: String,
        @Param("description") description: String,
        @Param("genre") genre: String,
        @Param("year") year: Int,
        @Param("poster") poster: String?,
        @Param("trailer") trailer: String?,
        @Param("video") video: String
    ): Int


    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ratings WHERE movie_id = :movieId", nativeQuery = true)
    fun deleteRatingsNative(movieId: Long)

    // ADD THIS: Delete reviews too!
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM reviews WHERE movie_id = :movieId", nativeQuery = true)
    fun deleteReviewsNative(movieId: Long)

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM favorites WHERE movie_id = :movieId", nativeQuery = true)
    fun deleteFromFavoritesNative(movieId: Long)

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_activities WHERE movie_id = :movieId", nativeQuery = true)
    fun deleteUserActivitiesNative(movieId: Long)


    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movies WHERE id = :movieId", nativeQuery = true)
    fun deleteMovieNative(movieId: Long): Int



//    For recommendation movies based on user activities

    @Query("""
    SELECT m FROM Movie m 
    WHERE m.genre IN :genres 
    AND (:excludedIds IS NULL OR m.id NOT IN :excludedIds)
    ORDER BY m.averageRating DESC
""")
    fun findRecommendations(
        @Param("genres") genres: List<String>,
        @Param("excludedIds") excludedIds: List<Long>,
        pageable: Pageable
    ): List<Movie>


    fun findByGenre(genre: String): List<Movie>

    fun findByGenreIgnoreCase(genre: String): List<Movie>

    /* =========================
       SORTING (NO PAGINATION)
    ========================== */
    fun findAllByOrderByAverageRatingDesc(): List<Movie>

    fun findAllByOrderByReleaseYearDesc(): List<Movie>

    fun findByGenreOrderByAverageRatingDesc(genre: String): List<Movie>

    fun findByGenreOrderByReleaseYearDesc(genre: String): List<Movie>

    fun findTop10ByOrderByAverageRatingDesc(): List<Movie>

    fun findTop5ByOrderByCreatedAtDesc():List<Movie>
    fun findTop10ByGenreOrderByAverageRatingDesc(genre: String): List<Movie>

    /* =========================
       PAGINATION
    ========================== */

    override fun findAll(pageable: Pageable): Page<Movie>

    fun findByGenre(
        genre: String,
        pageable: Pageable
    ): Page<Movie>

    fun findAllByOrderByAverageRatingDesc(
        pageable: Pageable
    ): Page<Movie>

    fun findByGenreOrderByAverageRatingDesc(
        genre: String,
        pageable: Pageable
    ): Page<Movie>

    /* =========================
       SEARCH (NO PAGINATION)
    ========================== */

    fun findByTitleContainingIgnoreCase(
        keyword: String
    ): List<Movie>

    fun findByTitleContainingIgnoreCaseOrderByAverageRatingDesc(
        keyword: String
    ): List<Movie>

    fun findByTitleContainingIgnoreCaseOrderByReleaseYearDesc(
        keyword: String
    ): List<Movie>

    /* =========================
       SEARCH + FILTER
    ========================== */

    fun findByTitleContainingIgnoreCaseAndGenreIgnoreCase(
        keyword: String,
        genre: String
    ): List<Movie>

    /* =========================
       SEARCH + PAGINATION
    ========================== */

    fun findByTitleContainingIgnoreCase(
        keyword: String,
        pageable: Pageable
    ): Page<Movie>

    fun findByTitleContainingIgnoreCaseAndGenreIgnoreCase(
        keyword: String,
        genre: String,
        pageable: Pageable
    ): Page<Movie>


    fun findById(id: jakarta.persistence.metamodel.SingularAttribute<org.springframework.data.jpa.domain.AbstractPersistable<java.io.Serializable>, java.io.Serializable>)



    companion object
}
