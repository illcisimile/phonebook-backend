const mongoose = require("mongoose");

if (process.argv.length <= 2) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstackopen:${password}@mern.o0htz4u.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length <= 3) {
  return Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}

if (name === undefined || number === undefined) {
  console.log("name and number are empty!");
  process.exit(1);
}

const person = new Person({
  name: name,
  number: number,
});

person.save().then((result) => {
  console.log(result);
  console.log(`added ${result.name} number ${result.number} to phonebook`);
  mongoose.connection.close();
});
