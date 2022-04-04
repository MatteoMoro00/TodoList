package com.digitazon.ToDoList.controllers;

import com.digitazon.ToDoList.entities.Category;
import com.digitazon.ToDoList.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/all")
    public Iterable<Category> getAll() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
