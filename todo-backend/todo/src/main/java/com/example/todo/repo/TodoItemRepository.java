package com.example.todo.repo;

import com.example.todo.model.TodoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoItemRepository extends JpaRepository<TodoItem, Integer> {

    // Custom: find all items for a specific parent list
    List<TodoItem> findByListId(Integer listId);
}
