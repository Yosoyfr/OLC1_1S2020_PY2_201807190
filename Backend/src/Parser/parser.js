const fs = require("fs");
const parser = require("../Grammar/Grammar");
const instruccionesAPI = require("../Instrucciones/intrucciones")
  .instruccionesAPI;

// leemos nuestro archivo de entrada
//const entrada = fs.readFileSync("./test.txt");
/**
 * @constant AST y ERRORES
 */
const createAST = {
  /**
   *
   * @param {String} entrada - Entrada de texto
   */
  create: function (entrada) {
    let analisis;
    try {
      // invocamos a nuestro parser con el contendio del archivo de entradas
      //Nos retorna el ast y los errores lexicos y sintacticos
      analisis = parser.parse(entrada.toString());
      instruccionesAPI.setLista();
      return analisis;
    } catch (e) {
      console.error(e);
      return;
    }
  },
};

//createAST.create(entrada);

module.exports.createAST = createAST;
