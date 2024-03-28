const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Book = require("./models/Book");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const password = require("./utils/pwd");

const app = express();
const uri = `mongodb+srv://p7-oc:${password}@cluster0.9hpqmgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
