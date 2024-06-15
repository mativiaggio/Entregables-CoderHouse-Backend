const express = require("express");
const multer = require("multer");
const router = express.Router();
const userModel = require("../models/users");
const fs = require("fs");
const path = require("path");

const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const basePath = path.join(__dirname, "../public/uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(basePath, "others");

    if (req.body.type === "profile") {
      uploadPath = path.join(basePath, "profiles");
    } else if (req.body.type === "product") {
      uploadPath = path.join(basePath, "products");
    } else if (req.body.type === "document") {
      uploadPath = path.join(basePath, "documents");
    }

    createDirectory(uploadPath);

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/:uid/documents", upload.array("documents"), async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const documents = req.files.map((file) => ({
      name: file.originalname,
      reference: file.path,
    }));

    user.documents = user.documents.concat(documents);
    await user.save();

    res.status(200).json({ message: "Documentos subidos exitosamente", user });
  } catch (error) {
    console.error("Error al subir documentos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/premium/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const requiredDocuments = [
      "Identificación",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta",
    ];
    const userDocuments = user.documents.map((doc) => doc.name);

    const hasAllRequiredDocuments = requiredDocuments.every((doc) =>
      userDocuments.includes(doc)
    );

    if (!hasAllRequiredDocuments) {
      return res.status(400).json({
        error: "Faltan documentos requeridos para actualizar a premium",
      });
    }

    user.role = "premium";
    await user.save();

    res
      .status(200)
      .json({ message: "Rol de usuario actualizado exitosamente", user });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
