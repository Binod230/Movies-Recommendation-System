//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.security
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.security.Key
import java.util.*

@Service
class JwtService {

    // IMPORTANT: Base64-encoded secret (must be SAME for generate + validate)
    private val SECRET_KEY =
        "bW92aWVodWJfc2VjcmV0X2tleV9mb3Jfand0X2F1dGhfc3lzdGVt"

    private fun getSigningKey(): Key {
        val keyBytes = Decoders.BASE64.decode(SECRET_KEY)
        return Keys.hmacShaKeyFor(keyBytes)
    }

    // GENERATE TOKEN
    fun generateToken(email: String, role: String): String {
        val claims = HashMap<String, Any>()
        claims["role"] = role

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(email)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24h
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact()
    }
    // EXTRACT USERNAME
    fun extractUsername(token: String): String =
        extractAllClaims(token).subject
    // VALIDATE TOKEN
    fun isTokenValid(token: String, userEmail: String): Boolean {
        val username = extractUsername(token)
        return username == userEmail && !isTokenExpired(token)
    }

    private fun isTokenExpired(token: String): Boolean =
        extractAllClaims(token).expiration.before(Date())

    private fun extractAllClaims(token: String): Claims =
        Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .body
}
