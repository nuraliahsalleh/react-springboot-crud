// src/main/java/com/example/todo/service/TodoStatsService.java
package com.example.todo.service;

import com.example.todo.repo.TodoListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TodoStatsService {

    private final TodoListRepository listRepo;

    public TodoStatsService(TodoListRepository listRepo) {
        this.listRepo = listRepo;
    }

    public Stats getStats(Integer listId) {
        int incomplete = listRepo.incompleteCount(listId);   // FUNCTION
        Integer counter = listRepo.getItemCount(listId);     // TRIGGER-maintained column
        if (counter == null) counter = 0;
        return new Stats(counter, incomplete);
    }

    public record Stats(int totalItems, int incompleteItems) {}
}
