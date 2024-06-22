const express = require('express')
const app = express()

let persons= [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get("/api/persons" ,(request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id" ,(request, response) => {
    const personId = new Number(request.params.id);
    const person = persons.filter(currentPerson => currentPerson.id = personId);

    return person? response.send(person) : response.status(502).send(`Person ${personId} not found`);
});

app.delete("/api/persons/:id" ,(request, response) => {
    const personId = new Number(request.params.id);
    const person = persons.filter(currentPerson => currentPerson.id == personId);

    if(person && person.length > 0){
        console.log("person found", person);
        persons = persons.filter( currentPerson => personId != currentPerson.id);
        response.send(person);
    } else {
        console.log("person not found");

        response.status(500).end();
    }
});

app.get("/info", (request, response) => {
    response.send(`Phonebook has ${persons.length} users.<br/>${new Date()} `);
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})