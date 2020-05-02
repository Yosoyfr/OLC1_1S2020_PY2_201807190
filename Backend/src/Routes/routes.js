const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.json({ Title: "Hello world" });
});

router.get("/send", (req, res) => {
  res.send({ Title: "Send" });
});

module.exports = router;
