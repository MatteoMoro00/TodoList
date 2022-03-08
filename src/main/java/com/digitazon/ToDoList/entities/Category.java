package com.digitazon.ToDoList.entities;

import javax.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)    //prende la strategia di generazione serial che usa il databse
    private int id;
    private String name;
    private String color;
}
