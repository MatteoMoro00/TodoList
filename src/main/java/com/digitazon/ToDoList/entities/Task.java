package com.digitazon.ToDoList.entities;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
//    @CreationTimestamp
//    @Temporal(TemporalType.TIMESTAMP)    //gestisce automaticamente in fase di creazione, setta la colonna created al valore del timestamp corrente
    private LocalDateTime created;
    private boolean done;
    @ManyToOne(fetch = FetchType.EAGER)                         //spring capisce che è una relazione many to one   //marca il campo come many to one   //fetch eager permette di caricare tuuti i campi della categoria, della tab referenziata (eager significa avido, volere tutto)
    @JoinColumn(name = "category_id")
    private Category category;

    public Category getCategory() {
        return category;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }
}
