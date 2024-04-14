const Book = require("../models/Book");
const fs = require("fs");

// requete GET pour récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

// requete GET pour récupérer les 3 meilleurs livres notés
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

// requete GET pour récupérer un livre par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// requete POST pour ajouter un livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`,
    ratings: [],
    averageRating: 0,
    //averageRating: bookObject.ratings[0].grade,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre ajouté" }))
    .catch((error) => res.status(400).json({ error }));
};

// requete PUT pour modifier un livre par son ID et supprimer l'ancienne image si modification
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        req.file &&
          fs.unlink(`images/${filename}`, (err) => {
            if (err) console.log(err);
          });
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// requete DELETE pour supprimer l'intégralité du livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// requete POST pour ajouter une note à un livre
exports.rateBook = (req, res, next) => {
  console.log("POST request to /:id/rating");
  if (0 <= req.body.rating <= 5) {
    const ratingObject = { ...req.body, grade: req.body.rating };
    delete ratingObject._id;
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        const newRatings = book.ratings;
        const userIdArray = newRatings.map((rating) => rating.userId);
        if (userIdArray.includes(req.auth.userId)) {
          res.status(403).json({ message: "Vous avez déjà noté ce livre" });
        } else {
          newRatings.push(ratingObject);
          //parcourir le tableau de notes
          const grades = newRatings.map((rating) => rating.grade);
          //fonction reduce pour réduire le tableau à une note (somme de toutes les notes)
          const sum = grades.reduce((acc, grade) => acc + grade, 0);
          //calcul de la moyenne et arrondit à une décimale
          const averageGrades = (sum / grades.length).toFixed(1);
          book.averageRating = averageGrades;
          Book.updateOne(
            { _id: req.params.id },
            {
              ratings: newRatings,
              averageRating: averageGrades,
              _id: req.params.id,
            }
          )
            .then(() => {
              res.status(201).json();
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
          res.status(200).json(book);
        }
      })
      .catch((error) => {
        res.status(404).json({ error });
      });
  } else {
    res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" });
  }
};
