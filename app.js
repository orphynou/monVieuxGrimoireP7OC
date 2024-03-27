const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Book = require("./models/Book");

const app = express();
const uri =
  "mongodb+srv://p7-oc:<password à crypter>@cluster0.mxknxdu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(uri, clientOptions)
  .then(() => console.log("connexion à MongoBD réussie !"))
  .catch(() => console.log("Connexion à MongoBD échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Ok fonctionnel, retourne bien un tableau
app.get("/api/books", (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json({ books: books }))
    .catch((error) => res.status(400).json({ error }));
});

//A vérifier si l'id est bien récupéré une fois bien avancé dans le code
app.get("/api/books/:id", (req, res, next) => {
  Book.findOne({ userId: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
});

//A compléter plus tard
app.get("/api/books/bestrating", (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json({ books: books }))
    .catch((error) => res.status(400).json({ error }));
});

//A compléter plus tard - Auth requis
app.post("/api/books", (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre ajouté" }))
    .catch((error) => res.status(400).json({ error }));
});

//A compléter plus tard - Auth requis
app.put("/api/books/:id", (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre modifié" }))
    .catch((error) => res.status(400).json({ error }));
});

//A compléter plus tard - Auth requis
app.delete("/api/books/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé" }))
    .catch((error) => res.status(400).json({ error }));
});

//A compléter plus tard - Auth requis
app.post("/api/books/:id/rating", (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Notation ajouté" }))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
