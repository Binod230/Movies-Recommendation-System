//SUBEDI RABIN M25W0465
package org.example.moviehubbackend.soap

import org.springframework.boot.web.servlet.ServletRegistrationBean
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.ws.config.annotation.EnableWs
import org.springframework.ws.transport.http.MessageDispatcherServlet
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition
import org.springframework.xml.xsd.SimpleXsdSchema
import org.springframework.xml.xsd.XsdSchema

@EnableWs
@Configuration
class SoapConfig {

    @Bean
    fun messageDispatcherServlet(applicationContext: ApplicationContext): ServletRegistrationBean<MessageDispatcherServlet> {
        val servlet = MessageDispatcherServlet()
        servlet.setApplicationContext(applicationContext)
        servlet.isTransformWsdlLocations = true
        return ServletRegistrationBean(servlet, "/ws-soap/*")
    }

    @Bean(name = ["movies"])
    fun defaultWsdl11Definition(moviesSchema: XsdSchema): DefaultWsdl11Definition {
        val wsdl11Definition = DefaultWsdl11Definition()
        wsdl11Definition.setPortTypeName("MoviesPort")
        wsdl11Definition.setLocationUri("/ws-soap")
        wsdl11Definition.setTargetNamespace("http://moviehub.com/soap")
        wsdl11Definition.setSchema(moviesSchema)
        return wsdl11Definition
    }

    @Bean
    fun moviesSchema(): XsdSchema {
        return SimpleXsdSchema(ClassPathResource("movies.xsd"))
    }
}