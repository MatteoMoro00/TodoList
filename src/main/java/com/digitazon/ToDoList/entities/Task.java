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
}
