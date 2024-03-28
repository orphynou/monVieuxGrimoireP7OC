const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/bestrating", bookCtrl.getBestThreeBooks);
router.post("/", bookCtrl.createBook);
router.put("/:id", bookCtrl.modifyBook);
router.delete("/api/books/:id", bookCtrl.deleteBook);
router.post("/:id/rating", bookCtrl.rateBook);

module.exports = router;
