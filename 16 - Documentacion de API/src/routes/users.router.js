const express = require("express");
const router = express.Router();
const userModel = require("../models/users");

router.put("/premium/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    user.role = user.role === "user" ? "premium" : "user";
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
