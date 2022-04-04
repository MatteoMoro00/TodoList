package com.digitazon.ToDoList.repositories;

import com.digitazon.ToDoList.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {           //JpaRepository extende PageAndSortingRepository che estende a sua volta CrudRepository  //estenderà per eredità più metodi (sarà di poco più pesante)
}
