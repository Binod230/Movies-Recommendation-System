//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.soap

import jakarta.xml.bind.annotation.*

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = ["count"])
@XmlRootElement(name = "getTotalMoviesResponse")
class GetTotalMoviesResponse {

    @XmlElement(required = true)
    var count: Int = 0
}