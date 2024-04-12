const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Enregistrement des images dans le dossier de destination /images/
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Remplacement des espaces et '.' par des '_' et ajoute la date et l'extension
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/[\s.]+/g, "_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

exports.imgStorage = multer({ storage: storage }).single("image");

exports.optimizedImage = async (req, res, next) => {
  try {
    // Vérification si un fichier a été téléchargé
    if (!req.file) {
      throw new Error("Aucune image téléchargée");
    }

    // Chemin de l'image téléchargée et renommage avec la nouvelle extension
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const optimizedFileName = `${fileName.split(".")[0]}_resized.webp`;
    const optimizedFilePatch = path.join("images", optimizedFileName);

    // Redimensionnement et conversion de l'image avec Sharp
    await sharp(filePath)
      .resize({ height: 300 })
      .toFormat("webp")
      .toFile(optimizedFilePatch);

    // Suppression de l'image originale et mise à jour du chemin et du nom
    fs.unlink(filePath, () => {});
    req.file.path = optimizedFilePatch;
    req.file.filename = optimizedFileName;
    next();
  } catch (error) {
    next(error);
  }
};
