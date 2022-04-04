let addButton = document.getElementById("add-button");
//console.log(addButton);
let input = document.getElementById("toDoList-input");
//console.log(input);
let list = document.getElementById("toDoList-list");
let errorMessage = document.getElementById("error-message");
let elementList = document.querySelectorAll("toDoList-list-element");
//console.log(elementList);
let lista = document.querySelectorAll("li");
let categorySelect = document.getElementById("task-category"); 
let taskContentValue = input.value;

let deleteAllButton = document.getElementById("delete-all-button");

let countContainer = document.getElementById("count-container");
let counterTask = document.getElementById("counter-task");
let counterTaskDone = document.getElementById("counter-task-done");
let counter = 0;
let counterDone = 0;

const HTTP_RESPONSE_SUCCESS = 200;
const REST_API_ENDPOINT = 'http://localhost:8080';

/**
 * questa funzione aggiorna la select delle categorie interrogando il server attraverso ajax
 * verrà invocata subito dopo il completo caricamento della pagina
 */
function updateCategoriesList() {
    //crea un oggetto di tipo XMLHttpRequest per gestire la chiamata ajax al server
    let ajaxRequest = new XMLHttpRequest();

    //gestisco l'evento onload: ovvero quello che succede dopo che il server mi risponde
    ajaxRequest.onload = function() {
        //mi salvo tutte le categorie ritornate dal server in una variabile nominata categories parsando il 
        //contenuto della response attraverso l'utility JSON.parse()
        let categories = JSON.parse(ajaxRequest.response);
        //console.log(categories);

        //cicliamo ogni categoria all'interno dell'array categories
        for (let category of categories) {
            //console.log(category);

            //creiamo un elemento di tipo option
            let newOption = document.createElement("option");

            //settiamo alla option il valore e il testo prendendolo dal nome della categoria
            newOption.value = category.id;
            newOption.innerText = category.name;

            //newOption.setAttribute
            
            //appendiamo l'option alla select
            categorySelect.appendChild(newOption);
        }
    }

    //imposto metodo e l'url a cui fare la richiesta (get) al server
    ajaxRequest.open("GET", REST_API_ENDPOINT + "/categories/all");

    //invio la richiesta al server
    ajaxRequest.send();
}

updateCategoriesList();

function createTask(task) {
    let taskDiv = document.createElement("div");
    taskDiv.setAttribute("data-id", task.id);
    taskDiv.classList.add("task-content");
    //console.log(taskDiv);

    list.append(taskDiv);

    console.log(categorySelect.options[categorySelect.selectedIndex]);
    selectedCategory = categorySelect.options[categorySelect.selectedIndex];
    //taskDiv.classList.add(selectedCategory.dataset.category);

    if (task.category != null) {
        taskDiv.classList.add(task.category.name);
    }
    
    let inputDiv = document.createElement("div");
    inputDiv.classList.add("input-div");
    taskDiv.appendChild(inputDiv);
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";

    checkbox.addEventListener("click", function() {
        //textTaskDiv.classList.toggle("checked");
        task.done = !task.done;    //imposto il valore oppsto
        let taskContent = {
            done: task.done//,
            //name: task.name
        };
        setDone(task.id, taskContent, () => {                     //3° elemento è la nostra succesfullCallback()
            //console.log("ho aggiornato il done");
            taskDiv.classList.toggle("checked");

            editButton.style.visibility = task.done ? "hidden" : "visible";

            counterTaskDone.innerHTML = task.done ? ++counterDone : --counterDone;
        });

        //alternativeUpdateTask(task.id, taskContent, taskDiv);
    });
    
    let textTaskDiv = document.createElement("div");
    textTaskDiv.classList.add("text-task-div");
    taskDiv.appendChild(textTaskDiv);
    let textP = document.createElement("p");
    textP.classList.add("text-task");
    textTaskDiv.appendChild(textP);
    
    let textElementList = document.createTextNode(task.name);
    
    textP.append(textElementList);

    if (task.done) {
        //textTaskDiv.classList.add("checked");
        taskDiv.classList.add("checked");
        checkbox.checked = true
    }
    inputDiv.append(checkbox);

    let pNewDate = document.createElement("p");
    let newDate = document.createElement("span");
    newDate.classList.add("task-date");
    let date = new Date(task.created);               //new date con imput la data di creazione
    newDate.innerText = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    //newDate.innerHTML = date;
    textTaskDiv.appendChild(pNewDate);
    pNewDate.appendChild(newDate);

    let deleteButtonDiv = document.createElement("div");
    deleteButtonDiv.classList.add("delete-button-div");
    taskDiv.appendChild(deleteButtonDiv);
    let closeButtonDiv = document.createElement("div");
    closeButtonDiv.classList.add("close-button-container");
    deleteButtonDiv.appendChild(closeButtonDiv);
    let closeButton = document.createElement("button");
    closeButton.innerHTML = `<i class="far fa-trash-alt"></i>`;
    closeButton.className = "close-button";

    closeButton.addEventListener("click", function() {
        deleteTask(task.id, taskDiv);
        //alternativeDeleteTask(task.id, taskDiv);
    });
    closeButtonDiv.appendChild(closeButton);

    let editButtonDiv = document.createElement("div");
    editButtonDiv.classList.add("edit-button-container");
    deleteButtonDiv.appendChild(editButtonDiv);

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    /*
    if (task.done) {
        editButton.classList.add("hidden");
    }
    if (!task.done) {
        editButton.classList.remove("hidden");
    }
    */
    editButton.style.visibility = task.done ? "hidden" : "visible";
    editButtonDiv.appendChild(editButton);
    
    editButton.addEventListener("click", function() {
        let inputSpan = document.createElement("input");
        inputSpan.classList.add("input-edit");
        inputSpan.value = textP.textContent;
        inputSpan.setAttribute("id", "input-edit-" + task.id);
        
        if (taskDiv.classList.contains("editing")) {
            let inputEdit = document.getElementById("input-edit-" + task.id);
            task.name = inputEdit.value;
            let taskContent = {
                //done: task.done,
                name: inputEdit.value
            };
            updateTask(task.id, taskContent, () => {              //terzo parametro è la succesfull callback
                //console.log("ho aggiornato il save");
                //aggiorno l'attributo name dell'oggetto task su cui sto lavorando
                task.name = inputEdit.value;
                textP.innerText = task.name;
                //chiamata ajax per aggiornare il record
                //sostituisco l'input con span contenente il testo aggiornato
                inputEdit.replaceWith(textP);
                //sostituisco dischetto con penna
                editButton.innerHTML = `<i class="fas fa-edit"></i>`;
                //rimuovo classe editing
                taskDiv.classList.remove("editing");

                //abilito la checkbox
                checkbox.style.visibility = "visible";
            });
        } else {
            //sostitusco span con input
            textP.replaceWith(inputSpan);
            //sostituisco penna con dischetto
            //editButton.innerText = "SAVE";
            editButton.innerHTML = `<i class="fas fa-save"></i>`;
            //aggiungo la classe editing
            taskDiv.classList.add("editing");

            //disabilito la checkbox
            checkbox.style.visibility = "hidden";
        }
    });

    //taskDiv.setAttribute("class", "unconfirmed");          //per gestire le chiamate ajax non ancora confermate
    //taskDiv.classList.add("unconfirmed");
    //sendTaskToServer(textElementList, taskDiv);

    if (task.done) {
        counterDone++;
    }
    counter ++;
    counterTask.innerText = counter;
    counterTaskDone.innerText = counterDone;

    input.value = "";
}

function updateTasksList() {
    //recupero i dati dal server
    let ajaxRequest = new XMLHttpRequest;

    ajaxRequest.onload = function() {            //la nostra call-back   -- eseguito se e quando arriva la risposta  --ajax lavora in asincrono
        let jsonResponse = JSON.parse(ajaxRequest.response);    //la chiamate ritorna una stringa e la parsiamo in un oggetto json
        //console.log(ajaxRequest.taskHTMLElement);
        //console.log(jsonResponse);
        //console.log(ajaxRequest);
        for (let task of jsonResponse) {
            createTask(task);
        }
    }

    ajaxRequest.open("GET", REST_API_ENDPOINT + "/tasks/");            //imposta il tipo - metodo di tipo get e il server destinazione
   
    ajaxRequest.send();              //metodo stringify per convertire in una stringa  //converto i valori in richiesta json
}

updateTasksList();             //richiamo il metodo

function saveTask(taskToSave, successfullCallback) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra call-back
        if (ajaxRequest.status == HTTP_RESPONSE_SUCCESS) {
            let savedTask = JSON.parse(ajaxRequest.response);
            //console.log(ajaxRequest.taskHTMLElement);
            //console.log(jsonResponse);
            createTask(savedTask);
            successfullCallback();
        }
    }

    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/add");            //imposta il tipo - metodo di tipo post e il server destinazione
    //il server è di tipo REST-full utilizza il tipo JSON per scambiare informazioni con il frontend
    //pertanto il server spring si aspetterà dei dati in formato JSON e NON considererà richieste in cui il formato non è specificato nella header della richiesta stessa
    ajaxRequest.setRequestHeader("content-type", "application/json");  //header di una request sono informazioni -- passo qualcosa in formato json -- application json significa formato json

    let body = {                                         //valori passati alla richiesta
        name: taskToSave.name,
        category: {
            id: taskToSave.categoryId
        },
        created: new Date()
    };
    console.log(body);
    ajaxRequest.send(JSON.stringify(body));      
}

function deleteTask(taskId, taskHtmlElement) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra caal-back    
        if (ajaxRequest.response == "ok") {
            
            counter --;
            if (taskHtmlElement.classList.contains("checked")) {
                counterDone --;
            }
            
            counterTask.innerHTML = counter;
            counterTaskDone.innerHTML = counterDone;

            taskHtmlElement.remove();
        } 
    }

    ajaxRequest.open("DELETE", REST_API_ENDPOINT + "/tasks/" + taskId);            //imposta il tipo - metodo di tipo post e il server destinazione
    ajaxRequest.send();
}

//funzione alternativa di delete che lavora in post
function alternativeDeleteTask(taskId, taskHtmlElement) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra caal-back    
        if (ajaxRequest.response == "ok") {
            taskHtmlElement.remove();
        } 
    }

    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/" + taskId + "/delete");            //imposta il tipo - metodo di tipo post e il server destinazione
    ajaxRequest.send();
}

function deleteAllTasks(successfullCallback) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra caal-back    
        if (ajaxRequest.response == "ok") {
            successfullCallback();
        } 
    }

    ajaxRequest.open("DELETE", REST_API_ENDPOINT + "/tasks/");            //imposta il tipo - metodo di tipo post e il server destinazione
    ajaxRequest.send();
}

function updateTask(taskId, taskContent, successfullCallback) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra caal-back
        if (ajaxRequest.status == HTTP_RESPONSE_SUCCESS) {           //se è andata a buon fine, se ha status 200
            successfullCallback();
        }
        console.log(ajaxRequest.status);
        
    }

    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId);            //imposta il tipo - metodo di tipo post e il server destinazione
    ajaxRequest.setRequestHeader("content-type", "application/json");  //header di una request sono info -- passo qualcosa in formaqtyo json

    ajaxRequest.send(JSON.stringify(taskContent));      
}

function setDone(taskId, taskContent, successfullCallback) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    //ajaxRequest.onload = () => {            //la nostra caal-back
        //if (!taskHtmlElement.classList.checked)
        //taskHtmlElement.classList.toggle("checked");
        successfullCallback();
    //}

    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId + "/set-done");            //imposta il tipo - metodo di tipo post e il server destinazione
    ajaxRequest.setRequestHeader("content-type", "application/json");  //header di una request sono info -- passo qualcosa in formaqtyo json

    ajaxRequest.send(JSON.stringify(taskContent));      
}

//funzione alternativa di update che lavora in post
function alternativeUpdateTask(taskId, taskContent, taskHtmlElement) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra caal-back
        taskHtmlElement.classList.toggle("checked");
    }

    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/" + taskId + "/edit");            //imposta il tipo - metodo di tipo post e il server destinazione
    ajaxRequest.setRequestHeader("content-type", "application/json");  //header di una request sono info -- passo qualcosa in formaqtyo json

    ajaxRequest.send(JSON.stringify(taskContent));      
}

function editTask(taskId, taskContent, taskHtmlElement) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra caal-back
        let input = document.createElement("input");
        input.value = taskContent;
    }

    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId);            //imposta il tipo - metodo di tipo post e il server destinazione
    ajaxRequest.setRequestHeader("content-type", "application/json");  //header di una request sono info -- passo qualcosa in formaqtyo json

    ajaxRequest.send(JSON.stringify(taskContent));    
}

addButton.addEventListener("click", function() {
    if (input.value == "") {
        errorMessage.innerHTML = "testo non valido";  
        return;
    }
    errorMessage.innerHTML = "";
    //console.log(input.value);
    console.log(categorySelect.value);

    //console.log(categorySelect.options(categorySelect.selectedIndex));
    //console.log(categorySelect.selectedIndex);
    
    //mi creo un oggetto che rappresenta il task da aggiungere...
    let task = {
        name: input.value,
        categoryId: categorySelect.value
    };
    //console.log(task);
    //saveTask(task);
    saveTask(task, () => {
        input.value = "";
    });
});

deleteAllButton.addEventListener("click", function() {
    deleteAllTasks(() => {
        counter = 0;
        counterDone = 0;
        
        counterTask.innerHTML = counter;
        counterTaskDone.innerHTML = counterDone;

        list.innerHTML = "";
    });
});

/*
function sendTaskToServer(taskContentValue, taskHTMLElement) {
    let ajaxRequest = new XMLHttpRequest;   //creo oggetto xmlhttprequest

    ajaxRequest.onload = () => {            //la nostra caal-back
        let jsonResponse = JSON.parse(ajaxRequest.response);
        //console.log(ajaxRequest.taskHTMLElement);
        console.log(jsonResponse);

        taskHTMLElement.classList.remove("unconfirmed");
        if (jsonResponse.result != "ok") {
            taskHTMLElement.classList.add("error");
        } 
    }

    ajaxRequest.open("POST", `https://webhook.site/22907f0f-d618-433b-9a3f-dd1cd596039e`);            //imposta il tipo - metodo di tipo post e il server destinazione
    //ajaxRequest.setRequestHeader("content-type", "application/json");              //per cambiare settare gli header della richiesta-- header coontent-type è molto importante, specifica il formato della request
    //ajaxRequest.send("ciao");                    //fa la chiamata  -- invio il testo, dati in json
    //ajaxRequest.setRequestHeader('Content-Type: application/json');
    //ajaxRequest.setRequestHeader("Access-Control-Allow-Origin", "*");

    let body = {                                         //valori passati alla richiesta
        text: taskContentValue
    };
    ajaxRequest.send(JSON.stringify(body));              //metodo stringify per convertire in una stringa  //converto i valori in richiesta json
}
*/

/*
1) git.digitazon.school creare nuovo repository PRIVATO chiamato TodoList
2) Aggiungere il repo a Visual Studio Code e pushare codice
3) Formattare con i CSS in questa grafica
https://image.winudf.com/v2/image1/Y29tLmRlZmluZGVycy5hcHAud2F0dG9kb19zY3JlZW5fMF8xNTY2NTc3NTUwXzAzMw/screen-0.jpg?fakeurl=1&type=.jpg
4) la lunghezza max di ogni task è 150 caratteri
5) Versione articolata aggiungere una select con options con name=“category”
shopping  spesa  activity   cleaning
5 tag, in base al tag si vede bordo di colore diverso
*/