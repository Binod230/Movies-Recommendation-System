//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/test")
class TestController {

    @GetMapping("/secure")
    fun secure(): String {
        return "Secure API works"
    }
}
