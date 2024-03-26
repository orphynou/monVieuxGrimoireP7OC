const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.end("requête reçue et test fonctionnel");
});

module.exports = app;
