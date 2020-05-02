const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

//Settings
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 2);

//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Start REST
//Routes
app.use(require("./Routes/routes"));

//Starting server
app.listen(3000, () => {
  console.log("Server on port", app.get("port"));
});
