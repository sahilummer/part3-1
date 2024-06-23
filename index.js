const express = require('express')
const morgan = require('morgan')
const cors = require('cors');

const app = express()

app.use(cors());
app.use(express.json())

morgan.token('method', function (req) { return req.method; });
morgan.token('url', function (req) { return req.originalUrl; });
morgan.token('status', function (req, res) { return res.statusCode; });
morgan.token('content_length', function (req, res) { return res.get('Content-Length') || 0; });
morgan.token('response_time', function (req, res) { return new Date() - req._startTime; });
morgan.token('data', function (req) { return JSON.stringify(req.body); });

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.content_length(req, res), '-', // Consistent dot notation
        tokens.response_time(req, res), 'ms', // Consistent dot notation
        tokens.data(req, res)
    ].join(' ');
}));

let persons = [
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

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const personId = new Number(request.params.id);
    console.log(personId);
    const person = persons.filter(currentPerson => currentPerson.id == personId);
    console.log(JSON.stringify(person));
    return person? response.send(person) : response.status(502).send(`Person ${personId} not found`);
});

app.post("/api/persons", (request, response) => {
    if (!request.body) {
        response.status(400).end();
    } else {
        const person = request.body;
        console.log(person);
        let max = 0;
        persons.forEach(element => {
            max = Math.max(max, element.id);
        });
        max++;
        person.id = max;
        persons.push(person);
        response.json(person);
    }

});

app.delete("/api/persons/:id", (request, response) => {
    const personId = new Number(request.params.id);
    const person = persons.filter(currentPerson => currentPerson.id == personId);

    if (person && person.length > 0) {
        console.log("person found", person);
        persons = persons.filter(currentPerson => personId != currentPerson.id);
        response.send(person);
    } else {
        console.log("person not found");

        response.status(500).end();
    }
});

app.get("/info", (request, response) => {
    response.send(`Phonebook has ${persons.length} users.<br/>${new Date()} `);
})

const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})