var fs = require("fs");
var parser = require("../Grammar/Grammar");

fs.readFile("./test.txt", (err, data) => {
  if (err) throw err;
  parser.parse(data.toString());
});
