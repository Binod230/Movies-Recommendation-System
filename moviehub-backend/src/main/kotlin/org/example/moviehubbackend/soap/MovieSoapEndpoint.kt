//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.soap
import org.example.moviehubbackend.repository.MovieRepository
import org.springframework.ws.server.endpoint.annotation.Endpoint
import org.springframework.ws.server.endpoint.annotation.PayloadRoot
import org.springframework.ws.server.endpoint.annotation.ResponsePayload

@Endpoint
class MovieSoapEndpoint(private val movieRepository: MovieRepository) {

    @PayloadRoot(namespace = "http://moviehub.com/soap", localPart = "getTotalMoviesRequest")
    @ResponsePayload
    fun getTotalMovies(): GetTotalMoviesResponse {
        val response = GetTotalMoviesResponse()
        // Fetch real count from PostgreSQL
        response.count = movieRepository.count().toInt()
        return response
    }
}