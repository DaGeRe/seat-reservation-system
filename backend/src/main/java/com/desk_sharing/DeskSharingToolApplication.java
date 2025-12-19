package com.desk_sharing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableScheduling
public class DeskSharingToolApplication {

	public static void main(String[] args) {
		SpringApplication.run(DeskSharingToolApplication.class, args);
	}
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
		@Override
		public void addCorsMappings(CorsRegistry registry) {
			registry.addMapping("/**")
				.allowedOrigins("http://localhost") // Hier die URL deines Frontends
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
				.allowedHeaders("*")
				.allowCredentials(true);
			}
		};
	}
}
