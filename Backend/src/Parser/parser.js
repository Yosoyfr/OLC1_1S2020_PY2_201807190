var fs = require("fs");
var parser = require("../Grammar/Grammar");

let ast;
try {
  // leemos nuestro archivo de entrada
  const entrada = fs.readFileSync("./test.txt");
  // invocamos a nuestro parser con el contendio del archivo de entradas
  ast = parser.parse(entrada.toString());
  // imrimimos en un archivo el contendio del AST en formato JSON
  fs.writeFileSync("./ast.json", JSON.stringify(ast, null, 2));
} catch (e) {
  console.error(e);
  return;
}
