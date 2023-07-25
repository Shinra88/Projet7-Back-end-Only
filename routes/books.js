const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const optiImage = require("../middleware/opti-Image");
const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBook);
router.post("/", auth, multer, optiImage, booksCtrl.createBook);
router.get("/bestrating", booksCtrl.getBestBooks);
router.get("/:id", booksCtrl.getOneBook);
router.put("/:id", auth, multer, optiImage, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.postBookRating);


module.exports = router;