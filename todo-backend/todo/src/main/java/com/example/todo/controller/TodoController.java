// src/main/java/com/example/todo/controller/TodoController.java
package com.example.todo.controller;

import com.example.todo.model.TodoItem;
import com.example.todo.model.TodoList;
import com.example.todo.service.TodoService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "*"})
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    // ===== Lists =====
    @GetMapping
    public List<TodoList> getAllLists() {
        return service.getAllLists();
    }

    @PostMapping
    public TodoList createList(@RequestBody CreateListReq req) {
        return service.createList(req.getTitle());
    }

    @PutMapping("/{listId}")
    public TodoList updateList(@PathVariable Integer listId, @RequestBody UpdateListReq req) {
        return service.updateList(listId, req.getTitle());
    }

    @DeleteMapping("/{listId}")
    public void deleteList(@PathVariable Integer listId) {
        service.deleteList(listId);
    }

    // ===== Items =====
    @PostMapping("/{listId}/items")
    public TodoItem addItem(@PathVariable Integer listId, @RequestBody CreateItemReq req) {
        return service.addItem(listId, req.getText());
    }

    @PutMapping("/{listId}/items/{itemId}")
    public TodoItem updateItem(@PathVariable Integer listId, @PathVariable Integer itemId, @RequestBody UpdateItemReq req) {
        return service.updateItem(listId, itemId, req.getText(), req.getCompleted());
    }

    @PatchMapping("/{listId}/items/{itemId}/toggle")
    public TodoItem toggleItem(@PathVariable Integer listId, @PathVariable Integer itemId) {
        return service.toggleItem(listId, itemId);
    }

    @DeleteMapping("/{listId}/items/{itemId}")
    public void deleteItem(@PathVariable Integer listId, @PathVariable Integer itemId) {
        service.deleteItem(listId, itemId);
    }

    // ===== DTOs =====
    @Data static class CreateListReq { private String title; }
    @Data static class UpdateListReq { private String title; }
    @Data static class CreateItemReq { private String text; }
    @Data static class UpdateItemReq { private String text; private Boolean completed; }
}
