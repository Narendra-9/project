package com.endava.endavastrength.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.endava.endavastrength.enums.Url;

/**
 * Configuration class for setting up Cross-Origin
 * 
 * This class configures which domains, methods, and headers are allowed for cross-origin requests.
 * Here, requests from `http://localhost:3000` are allowed.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures CORS mapping to allow specific origins and HTTP methods.
     * 
     * @param registry the CorsRegistry to register the CORS configuration
     * @return void
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(Url.CORS_URL.getMessage()) 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") 
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}