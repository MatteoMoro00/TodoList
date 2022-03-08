package com.digitazon.ToDoList.controllers;

import com.digitazon.ToDoList.repositories.TaskRepository;
import org.springframework.web.bind.annotation.*;

@RestController            //non è il pacchetto nvc completo,(non dobbiamo specificare l'output), è applicazione REST --output dei metodi, dati mostrati in formato json, java fara il parsing dei risultati in json
public class TaskController {

    private TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {              //iniettiamo le dipendenze del repository tramite il costruttore- potenza di Spring
        this.taskRepository = taskRepository;
    }

    //@RequestMapping(value = "/", method = RequestMethod.GET)   //mapping che risponde all'url del browser, ed ha un metodo get
    @GetMapping("/")
    public String home() {
        long total = taskRepository.count();
        System.out.println(total);
        return "Benvenuti nella nostra Homepage";
    }
}
