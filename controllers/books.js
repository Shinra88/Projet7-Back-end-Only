const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        averageRating: bookObject.ratings[0].grade
    });
  
    book.save()
    .then(() => { res.status(201).json({message: "Objet enregistré !"})})
    .catch(error => { res.status(400).json( { error })})
 };

 exports.modifyBook = (req, res, next) => {
  
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body }

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
    .then((book) => {
      if (book === null) {
        return res.status(404).json({ error: "Ce livre n'existe pas !" });
      } else if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "Demande non autorisée" });
      } else if (req.file) {
        //si nouvelle image supression de l'ancienne
        const filename = book.imageUrl.split("/images")[1];
        fs.promises.unlink(`images/${filename}`)
          .catch((error) => res.status(500).json({ error }));
      }
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Livre modifié!" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

 exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: "Not authorized"});
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: "Objet supprimé !"})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
  };
  
  exports.getAllBook = (req, res, next) => {
    Book.find()
   .then(books => res.status(200).json(books))
   .catch(error => res.status(404).json({ error }));
  };

exports.postBookRating = (req, res, next) => {

  const newRating = { ...req.body };
  newRating.grade = newRating.rating;
  delete newRating.rating;
  //ajout de la valeur grade, car les datas envoyées par le front ne sont pas celles attendues
  // (rating au lieu de grade)
  // userId: , rating:  à la place de userId: , grade

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const savBook = {...book._doc};
      savBook.ratings = [{...newRating}, ...book.ratings];


      //La fonction avr est égale au nouveau averageRating)
      // On prend la some avec reduce qui accumule les elem.grade et le divise par leur longeur avec length
      // et Math.round * 100 / 100 permet d"arrondir le résultat à 2 chiffres après la virgule
      function calcAverageGrade(arr) {
        let avr = Math.round((arr.reduce((acc, elem) => acc + elem.grade, 0) / arr.length) * 100) / 100;
        return avr;
      };
      savBook.averageRating = calcAverageGrade(savBook.ratings);

      Book.updateOne(
        { _id: req.params.id },
        {...savBook}
        )
        .then(() => {
          res.status(200).json(savBook);
        })
        .catch((err) => {
          res.status(401).json({err});
        });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getBestBooks = (req, res, next) => {
    Book.find()
      .then((books) => {
        res
          .status(200)
          // copie de mon tableau datas;
          // classement en décroissante avec sort
          //splice récupérer les 3 premiers livres.
          .json(
            [...books]
              .sort((a, b) => b.averageRating - a.averageRating)
              .splice(0, 3)
          );
      })
      .catch((error) => res.status(400).json({ error }));
  };