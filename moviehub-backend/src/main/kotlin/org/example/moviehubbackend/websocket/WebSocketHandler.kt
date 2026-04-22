//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.websocket
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.CopyOnWriteArrayList

@Component
class MovieNotificationHandler : TextWebSocketHandler() {
    private val sessions = CopyOnWriteArrayList<WebSocketSession>()

    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessions.add(session)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        sessions.remove(session)
    }

    fun broadcast(movieTitle: String) {
        val payload = "{\"title\": \"$movieTitle\"}"
        sessions.forEach { it.sendMessage(TextMessage(payload)) }
    }
}