//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(ex: ResourceNotFoundException): ResponseEntity<Map<String, Any>> {
        return ResponseEntity(
            mapOf(
                "status" to 404,
                "error" to "NOT_FOUND",
                "message" to ex.message!!
            ),
            HttpStatus.NOT_FOUND
        )
    }

    @ExceptionHandler(BadRequestException::class)
    fun handleBadRequest(ex: BadRequestException): ResponseEntity<Map<String, Any>> {
        return ResponseEntity(
            mapOf(
                "status" to 400,
                "error" to "BAD_REQUEST",
                "message" to ex.message!!
            ),
            HttpStatus.BAD_REQUEST
        )
    }
}
