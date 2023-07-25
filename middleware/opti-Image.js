const sharp = require("sharp");
const fs = require("fs");

// Compression des images
const optiImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  
  // Chemin du fichier d'origine
  const imagePath = req.file.path;
  // changement de nom du fichier
  const fileName = req.file.filename.split('.')[0];
  const compressedFileName = `${fileName}${Date.now()}.webp`;

  // Nouveau chemin pour l'image compressée
  const compressedImagePath = `${req.file.destination}/${compressedFileName}`;

  // Compression de l'image
  sharp(imagePath)
    .resize(352, 568, {
      fit: 'fill'})
    .webp()
    .toFile(compressedImagePath, (error) => {
      if (error) {
        return res.status(500).json({ error: "Erreur pendant la compression de l'images" });
      };

      // Maj de l'image, nouveau chemin et nom
      req.file.filename = compressedFileName;
      req.file.path = compressedImagePath;

      // Suppression de l'ancien fichier
      fs.unlinkSync(imagePath);
      
      next();
    });
};

module.exports = optiImage;