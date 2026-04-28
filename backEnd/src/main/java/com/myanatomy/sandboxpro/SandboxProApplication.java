package com.myanatomy.sandboxpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SandboxProApplication {

	public static void main(String[] args) {
		SpringApplication.run(SandboxProApplication.class, args);
	}

}
