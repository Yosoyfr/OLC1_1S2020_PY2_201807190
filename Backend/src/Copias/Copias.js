const Clases = require("../models/Clases");
const Metodos = require("../models/Metodos");
const Parametros = require("../models/Parametros");

var clasesEncontradas = new Array();
var newClase = new Clases.clase(null);
var newMetodo_Funcion = new Metodos.metodo(null, null, null);
const Copias = {
  /**
   * Funcion para ver los los odos de la raiz del archivo {imports y clases}
   * @param {Objeto AST} ast
   */
  analisisArchivo: function (ast) {
    if (ast["RAIZ"] !== undefined) {
      clasesEncontradas = new Array();
      this.analisisClases(ast["RAIZ"]);
      return clasesEncontradas;
    }
  },

  /**
   * Funcion recursiva para entrar a los nodos que tengan que ver con clases
   * @param {Objeto AST} ast
   */
  analisisClases: function (ast) {
    if (ast["CLASS"] !== undefined) {
      this.analisisClases(ast["CLASS"]);
      clasesEncontradas.push(this.analisisClase(ast["CLASS"]));
    }
  },

  /**
   * Funcion para obtener los parametros de la clase a partir del ast enviado
   * @param {Objeto AST} ast
   */
  analisisClase: function (ast) {
    if (ast["CLASSP"] !== undefined) {
      newClase = new Clases.clase(ast["CLASSP"].IDENTIFICADOR);
      this.analisisBloqueClase(
        ast["CLASSP"].BLOQUE_CLASE,
        ast["CLASSP"].IDENTIFICADOR
      );
      return newClase;
    }
  },

  /**
   * Funcion recursiva para revisar los metodos de la clase
   * @param {Objeto AST} ast
   */
  analisisBloqueClase: function (ast, clase) {
    if (ast["BLOQUE_CLASEP"] !== undefined) {
      this.analisisBloqueClase(ast["BLOQUE_CLASEP"], clase);
      this.analisisFunciones_Metodos(
        ast["BLOQUE_CLASEP"].BLOQUE_CLASEPP,
        clase
      );
    }
  },

  /**
   * Funcion para leer los atributos del nodo metodo en el AST
   * @param {Objeto AST} ast -
   */
  analisisFunciones_Metodos: function (ast, clase) {
    if (ast["METODOS"] !== undefined) {
      const aux = ast["METODOS"];
      newMetodo_Funcion = new Metodos.metodo("void", aux.IDENTIFICADOR, clase);
      this.analisisParametros(aux);
      newClase.addMetodo(newMetodo_Funcion);
    } else if (ast["FUNCIONES"] !== undefined) {
      const aux = ast["FUNCIONES"];
      newMetodo_Funcion = new Metodos.metodo(
        aux.TIPO,
        aux.IDENTIFICADOR,
        clase
      );
      this.analisisParametros(aux);
      newClase.addMetodo(newMetodo_Funcion);
    }
  },
  /**
   *Funcion recursiva de los parametros  de una funcion o metodo
   * @param {Objeto AST} ast
   */
  analisisParametros: function (ast) {
    if (ast["PARAMETROS"] !== undefined) {
      this.analisisParametros(ast["PARAMETROS"]);
      newMetodo_Funcion.addParam(this.analisisParam(ast["PARAMETROS"]));
    }
  },

  /**
   * Funcion para recuperar los atributos de
   * @param {Objeto AST} ast
   */
  analisisParam: function (ast) {
    if (ast["PARAMETRO"] !== undefined) {
      const param = ast["PARAMETRO"];
      return new Parametros.parametro(param.TIPO, param.IDENTIFICADOR);
    }
  },

  /**
   *Funcion para comparar las clases entre los dos archivos
   * @param { Lista de clases } original
   * @param { Lista de clases } copia
   */
  compareClase: function (original, copia) {
    let Metodos_Copias_Clases = new Array();
    let Copias_Clases = new Array();
    original.forEach((clasesO) => {
      copia.forEach((clasesC) => {
        if (clasesC.nombre.match(clasesO.nombre)) {
          let Metodos_Copia = this.compareMetodos(
            clasesO.metodos,
            clasesC.metodos
          );
          Metodos_Copia.forEach((metodoEncontrado) => {
            Metodos_Copias_Clases.push(metodoEncontrado);
          });
          if (Metodos_Copia.length === clasesO.metodos.length) {
            Copias_Clases.push({
              CLASE_ORIGINAL: {
                nombre: clasesO.nombre,
                metodos: clasesO.metodos.length,
              },
              CLASE_COPIA: {
                nombre: clasesC.nombre,
                metodos: clasesC.metodos.length,
              },
            });
          }
        }
      });
    });
    return { CLASES: Copias_Clases, METODOS: Metodos_Copias_Clases };
  },

  /**
   * Funcion para comparar los metodos de una clase
   * @param {Lista de clases } original
   * @param {Lista de clases } copia
   */
  compareMetodos: function (original, copia) {
    let Metodos_Copia = new Array();
    original.forEach((metodosO) => {
      copia.forEach((metodosC) => {
        if (
          metodosC.tipo.match(metodosO.tipo) &&
          metodosC.parametros.length === metodosO.parametros.length
        ) {
          let copiasParametros = this.compareParametros(
            metodosO.parametros,
            metodosC.parametros
          );
          if (copiasParametros === metodosO.parametros.length) {
            Metodos_Copia.push({
              METODO_ORIGINAL: metodosO,
              METODO_COPIA: metodosC,
            });
          }
        }
      });
    });
    return Metodos_Copia;
  },

  /**
   * Funcion que verifica que el metodo posee coincidencias en parametros
   * @param {Lista de parametros } original
   * @param {Lista de parametros } copia
   */
  compareParametros: function (original, copia) {
    let copiasEncontradas = 0;
    for (let i = 0; i < original.length; i++) {
      const paramO = original[i];
      const paramC = copia[i];
      if (paramO.tipo === paramC.tipo) {
        copiasEncontradas++;
      }
    }
    return copiasEncontradas;
  },
};

module.exports.Copias = Copias;
