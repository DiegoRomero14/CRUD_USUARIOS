const express = require("express");
const cors = require("cors");
const { Usuario } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

// CRUD Usuarios
// GET Todos los usuarios
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

// POST Crear usuario
app.post("/usuarios", async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.json(usuario);
});

// PUT Actualizar usuario
app.put("/usuarios/:id", async (req, res) => {
  await Usuario.update(req.body, { where: { id: req.params.id } });
  res.json({ success: "Usuario actualizado" });
});

// DELETE Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.json({ success: "Usuario eliminado" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));