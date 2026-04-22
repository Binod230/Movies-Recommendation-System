//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.config

import org.example.moviehubbackend.websocket.MovieNotificationHandler
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(private val notificationHandler: MovieNotificationHandler) : WebSocketConfigurer {
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(notificationHandler, "/notifications")
            .setAllowedOrigins("http://localhost:5173") //  Specifically allow  frontend
    }
}