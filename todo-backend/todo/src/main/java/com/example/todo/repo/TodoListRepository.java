package com.example.todo.repo;

import com.example.todo.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TodoListRepository extends JpaRepository<TodoList, Integer> {

    // Call MySQL FUNCTION (fn_incomplete_count)
    @Query(value = "SELECT fn_incomplete_count(?1)", nativeQuery = true)
    int incompleteCount(Integer listId);

    // Read the trigger-maintained counter (item_count column)
    @Query(value = "SELECT item_count FROM todo_lists WHERE id = ?1", nativeQuery = true)
    Integer getItemCount(Integer listId);
}
