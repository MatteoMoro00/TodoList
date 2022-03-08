package com.digitazon.ToDoList.repositories;

import com.digitazon.ToDoList.entities.Task;
import org.springframework.data.repository.CrudRepository;

public interface TaskRepository extends CrudRepository<Task, Integer> {
}
