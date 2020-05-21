const { Router } = require("express");
const router = Router();
const createAST = require("../Parser/parser").createAST;

router.get("/", (req, res) => {
  res.json({ Title: "Hello" });
});

router.get("/send", (req, res) => {
  res.send({ Title: "Send" });
});

router.post("/parser", async (req, res) => {
  //console.log(req.body.text);
  const text = req.body.text;
  const analisis = createAST.create(text);
  const ast = JSON.stringify(analisis.AST, null, 2);
  const errores = JSON.stringify(analisis.ERRORES, null, 2);
  res.send({ message: "Compilacion terminada", AST: ast, ERRORES: errores });
});

module.exports = router;
