package com.example.todo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DbPing {
    @Bean
    CommandLineRunner pingDb(DataSource ds) {
        return args -> {
            try (Connection c = ds.getConnection()) {
                System.out.println("✅ Connected to MySQL as " + c.getMetaData().getUserName());
            }
        };
    }
}
