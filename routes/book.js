const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post(
  "/",
  auth,
  upload.imgStorage,
  upload.optimizedImage,
  bookCtrl.createBook
);
router.put(
  "/:id",
  auth,
  upload.imgStorage,
  upload.optimizedImage,
  bookCtrl.modifyBook
);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
