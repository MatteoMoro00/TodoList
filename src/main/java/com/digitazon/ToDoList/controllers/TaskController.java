package com.digitazon.ToDoList.controllers;

import com.digitazon.ToDoList.entities.Category;
import com.digitazon.ToDoList.entities.Task;
import com.digitazon.ToDoList.repositories.CategoryRepository;
import com.digitazon.ToDoList.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController            //non è il pacchetto nvc completo,(non dobbiamo specificare l'output), è applicazione REST --output dei metodi, dati mostrati in formato json, java fara il parsing dei risultati in json
@RequestMapping("/tasks")            //per arrivare a questo controller
@CrossOrigin(origins = "*")    //per disabilitare i CORS, qualsiasi rotta sotto /task può ricevere da qualsiasi rotta  //per disabilitare i CORS
public class TaskController {

    @Autowired             //autocablaggio, aggiunde alla classe il bytecode del costruttore -- aggiunge in automatico il costruttore con l'iniezione delle dipendenze
    private TaskRepository taskRepository;

    @Autowired
    private CategoryRepository categoryRepository;

//    public TaskController(TaskRepository taskRepository) {              //iniettiamo le dipendenze del repository tramite il costruttore- potenza di Spring
//        this.taskRepository = taskRepository;
//    }

    //@RequestMapping(value = "/", method = RequestMethod.GET)   //mapping che risponde all'URL del browser, ed ha un metodo get
    @GetMapping("/")
    public Iterable<Task> home() {
//        long total = taskRepository.count();
//        System.out.println(total);
        Iterable<Task> tasks = taskRepository.findAll(Sort.by(Sort.Direction.ASC, "created"));          //metodo sort statico (non devo creare l'oggetto) metodo statico by della classe sort - ordina in modo discenddente secondo la tabella created --metodo find all di jparep implementa il sorting
        System.out.println(tasks);
        return tasks;
    }

    @GetMapping("/{id}")
    public Task read(@PathVariable int id) {            //non optional, ci pensa spring a gestire l'eccezione        //id input preso direttamante da spring tramite la richiesta
        return taskRepository.findById(id).orElseThrow();           //anzichè il.get() per gestire l'optional, usiamo orElseThrow() che in caso lancial'eccezione, l'errore 404(risorsa non trovata)
    }

    @PostMapping("/add")
    public Task create(@RequestBody Task newTask) {           //spring prende la request del body, li mappa in un oggetto di tipo task e se ci riesce ce lo mette a disposizione
        //System.out.println(newTask.getCategory().getColor());
        Task savedTask = taskRepository.save(newTask);
        //System.out.println(savedTask.getCategory());
        Category category = categoryRepository.findById(savedTask.getCategory().getId()).orElseThrow();
        savedTask.setCategory(category);
        return savedTask;
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        taskRepository.deleteById(id);
        return "ok";
    }

//    @DeleteMapping("/{id}")
//    public void delete(@PathVariable int id) {
//        taskRepository.deleteById(id);
//    }

    @DeleteMapping("/")
    public String deleteAll() {
        taskRepository.deleteAll();
        return "ok";
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable int id, @RequestBody Task updatedTask) throws Exception {      //
        Task task = taskRepository.findById(id).orElseThrow();            //recuperiamo il vecchio task (ciò che è salvato sul database) -- .get perchè ritorna un optional, .orelsethrow
        if (task.isDone()) {                                            //modifica solo se il task non è già done
            throw new Exception("cannot update done task");            //se il task è done lanciamo una eccezione
        }
        task.setName(updatedTask.getName());
        return taskRepository.save(task);
    }

    @PutMapping("/{id}/set-done")                 //endpoint per gestire solo il setdone
    public Task setDone(@PathVariable int id, @RequestBody Task updatedTask) {      //
        Task task = taskRepository.findById(id).orElseThrow();            //recuperiamo il vecchio task (ciò che è salvato sul database) -- .get perchè ritorna un optional, .orelsethrow
        task.setDone(updatedTask.isDone());
        return taskRepository.save(task);
    }


    //Creare una versione alternativa dei metodi delete e update (alternativeDelete, alternativeUpdate) che lavorino in POST ai seguenti indirizzi
    //tasks/{id}/edit
    //tasks/{id}/delete


    @PostMapping("/{id}/delete")
    public String alternativeDelete(@PathVariable int id) {
        taskRepository.deleteById(id);
        return"ok";
    }


    @PostMapping("/{id}/edit")
    public Task alternativeUpdate(@PathVariable int id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElseThrow();            //recuperiamo il vecchio task (ciò che è salvato sul database) -- .get perchè ritorna un optional, .orelsethrow
        task.setDone(updatedTask.isDone());
        task.setName(updatedTask.getName());
        return taskRepository.save(task);
    }
}
