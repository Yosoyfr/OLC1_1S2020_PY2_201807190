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
  const ast = createAST.create(text);
  res.send({ message: "Compilacion terminada", AST: ast });
});

module.exports = router;
