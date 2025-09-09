// src/main/java/com/example/todo/model/TodoList.java
package com.example.todo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "todo_lists")
public class TodoList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Total items (optional if you still keep item_count in DB)
    @Builder.Default
    @Column(name = "item_count", nullable = false)
    private Integer itemCount = 0;

    // Incomplete items (maintained by triggers)
    @Builder.Default
    @Column(name = "incomplete_count", nullable = false)
    private Integer incompleteCount = 0;

    @OneToMany(
            mappedBy = "list",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @OrderBy("id DESC")
    @JsonManagedReference
    private List<TodoItem> items = new ArrayList<>();

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (itemCount == null) itemCount = 0;           // safeguard
        if (incompleteCount == null) incompleteCount = 0; // safeguard
    }

    // Utility methods to manage both sides of the relationship
    public void addItem(TodoItem item) {
        items.add(item);
        item.setList(this);
    }

    public void removeItem(TodoItem item) {
        items.remove(item);
        item.setList(null);
    }
}
