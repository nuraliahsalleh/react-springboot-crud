// src/main/java/com/example/todo/service/TodoService.java
package com.example.todo.service;

import com.example.todo.model.TodoItem;
import com.example.todo.model.TodoList;
import com.example.todo.repo.TodoItemRepository;
import com.example.todo.repo.TodoListRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TodoService {

    private final TodoListRepository listRepo;
    private final TodoItemRepository itemRepo;

    public TodoService(TodoListRepository listRepo, TodoItemRepository itemRepo) {
        this.listRepo = listRepo;
        this.itemRepo = itemRepo;
    }

    // ===== Lists =====
    public List<TodoList> getAllLists() {
        // DB triggers keep counts current; just return sorted lists
        return listRepo.findAll()
                .stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .toList();
    }

    public TodoList createList(String title) {
        String t = title == null ? "" : title.trim();
        if (t.isEmpty()) throw new IllegalArgumentException("title is required");

        // Ensure both counters start at 0. (DB has DEFAULT 0 too.)
        TodoList list = TodoList.builder()
                .title(t)
                .itemCount(0)        // keep if you still persist total count
                .incompleteCount(0)  // maintained by triggers on todo_items
                .build();
        return listRepo.save(list);
    }

    public TodoList updateList(Integer id, String title) {
        TodoList list = listRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("List not found: " + id));
        if (title != null && !title.trim().isEmpty()) {
            list.setTitle(title.trim());
        }
        return list;
    }

    public void deleteList(Integer id) {
        if (!listRepo.existsById(id)) {
            throw new EntityNotFoundException("List not found: " + id);
        }
        listRepo.deleteById(id);
    }

    // ===== Items =====
    public TodoItem addItem(Integer listId, String text) {
        TodoList list = listRepo.findById(listId)
                .orElseThrow(() -> new EntityNotFoundException("List not found: " + listId));

        String tx = text == null ? "" : text.trim();
        if (tx.isEmpty()) throw new IllegalArgumentException("text is required");

        TodoItem item = TodoItem.builder()
                .list(list)
                .text(tx)
                .completed(false) // default; triggers will +1 incomplete_count
                .build();

        return itemRepo.save(item);
    }

    public TodoItem updateItem(Integer listId, Integer itemId, String text, Boolean completed) {
        TodoItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + itemId));

        if (!item.getList().getId().equals(listId)) {
            throw new IllegalArgumentException("Item does not belong to list " + listId);
        }

        if (text != null && !text.trim().isEmpty()) item.setText(text.trim());
        if (completed != null) item.setCompleted(completed); // triggers adjust incomplete_count on UPDATE

        return item; // managed entity persisted by @Transactional
    }

    public TodoItem toggleItem(Integer listId, Integer itemId) {
        TodoItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + itemId));

        if (!item.getList().getId().equals(listId)) {
            throw new IllegalArgumentException("Item does not belong to list " + listId);
        }

        item.setCompleted(!Boolean.TRUE.equals(item.getCompleted())); // triggers handle +/- on toggle
        return item;
    }

    public void deleteItem(Integer listId, Integer itemId) {
        TodoItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + itemId));

        if (!item.getList().getId().equals(listId)) {
            throw new IllegalArgumentException("Item does not belong to list " + listId);
        }

        // triggers will decrement counts if needed
        itemRepo.delete(item);
    }
}
