const { Router } = require("express");
const router = Router();
const createAST = require("../Parser/parser").createAST;
const Copias = require("../Copias/Copias");

router.get("/", (req, res) => {
  res.json({ Saludo: "Bienvenido a mi backend" });
});

router.post("/parser", async (req, res) => {
  const text = req.body.text;
  const analisis = await createAST.create(text);
  const ast = JSON.stringify(analisis.AST, null, 2);
  const errores = JSON.stringify(analisis.ERRORES, null, 2);
  res.send({ message: "Compilacion terminada", AST: ast, ERRORES: errores });
});

router.post("/copias", async (req, res) => {
  const analisisOriginal = await createAST.create(req.body.original);
  const analisisCopia = await createAST.create(req.body.copia);
  const original = await Copias.Copias.analisisArchivo(analisisOriginal.AST);
  const copia = await Copias.Copias.analisisArchivo(analisisCopia.AST);
  const resultadoCopia = await Copias.Copias.compareClase(original, copia);
  res.send({ message: "Analisis terminado", COPIAS: resultadoCopia });
});

module.exports = router;
