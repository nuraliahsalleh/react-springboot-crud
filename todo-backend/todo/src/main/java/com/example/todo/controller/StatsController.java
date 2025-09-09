// src/main/java/com/example/todo/controller/StatsController.java
package com.example.todo.controller;

import com.example.todo.service.TodoStatsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174","*"})
public class StatsController {

    private final TodoStatsService statsService;

    public StatsController(TodoStatsService statsService) {
        this.statsService = statsService;
    }

    // GET /api/stats/{listId}
    @GetMapping("/{listId}")
    public StatsResponse get(@PathVariable Integer listId) {
        var s = statsService.getStats(listId);
        return new StatsResponse(s.totalItems(), s.incompleteItems());
    }

    public record StatsResponse(int totalItems, int incompleteItems) {}
}
