const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");

app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(express.static("build"));

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return response.status(404).json({ error: "name is missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    res.send(`<p>Phonebook has info for ${count} people.</p><p>${new Date()}</p>`);
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
