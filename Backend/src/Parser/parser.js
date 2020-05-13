var parser = require("../Grammar/Grammar");

const createAST = {
  create: function (entrada) {
    let ast;
    try {
      // invocamos a nuestro parser con el contendio del archivo de entradas
      ast = parser.parse(entrada.toString());
      return JSON.stringify(ast, null, 2);
    } catch (e) {
      console.error(e);
      return;
    }
  },
};

module.exports.createAST = createAST;
