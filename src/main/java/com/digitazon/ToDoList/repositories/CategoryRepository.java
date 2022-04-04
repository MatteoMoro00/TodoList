package com.digitazon.ToDoList.repositories;

import com.digitazon.ToDoList.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
