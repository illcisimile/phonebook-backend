const express = require("express");
const app = express();
const morgan = require("morgan");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000 + 1);
  return id;
};

app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: !body.name ? "name is missing" : "number is missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get("/", (req, res) => {
  res.send("<p>hello</p>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
