// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
  NUMERO: "V_NUMERO",
  IDENTIFICADOR: "V_IDENTIFICADOR",
  CADENA: "V_CADENA",
  CARACTER: "V_CHAR",
  BOOLEANO: "V_BOOLEANO",
};

// Constantes para los tipos de 'opes' que soporta nuestra gramática.
const TIPO_OP = {
  SUMA: "OP_SUMA",
  RESTA: "OP_RESTA",
  MULTIPLICACION: "OP_MULTIPLICACION",
  DIVISION: "OP_DIVISION",
  POTENCIA: "OP_POTENCIA",
  MODULO: "OP_MODULO",
  NEGATIVO: "OP_NEGATIVO",
  INCREMENTO: "OP_INCREMENTO",
  DECREMENTO: "OP_DECREMENTO",
  MAYOR_QUE: "OP_MAYOR_QUE",
  MENOR_QUE: "OP_MENOR_QUE",
  MAYOR_IGUAL_QUE: "OP_MAYOR_IGUAL_QUE",
  MENOR_IGUAL_QUE: "OP_MENOR_IGUAL_QUE",
  IGUALDAD: "OP_IGUALDAD",
  DISTINTO: "OP_DISTION",
  AND: "OP_AND",
  OR: "OP_OR",
  NOT: "OP_NOT",
};

// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
  IMPORT: "INST_IMPORT",
  CLASS: "INST_CLASS",
  DECLARACION: "INST_DECLARACION",
  ASIGNACION: "INST_ASIGANCION",
  IF: "INST_IF",
  ELSE: "INST_ELSE",
  SWITCH: "INST_SWITCH",
  WHILE: "INST_WHILE",
  DO: "INST_DO",
  FOR: "INST_FOR",
  PRINT: "INST_PRINT",
};

// Constantes para los tipos de OPCION_SWITCH validas en la gramática
const TIPO_OPCION_SWITCH = {
  CASO: "CASO",
  DEFECTO: "DEFECTO",
};

/**
 * Esta función se encarga de crear objetos tipo Operación.
 * Recibe como parámetros el operando izquierdo y el operando derecho.
 * También recibe como parámetro el tipo del operador
 * @param {*} operandoIzq
 * @param {*} operandoDer
 * @param {*} tipo
 */
function nuevaOp(operandoIzq, operandoDer, tipo) {
  return {
    operandoIzq: operandoIzq,
    operandoDer: operandoDer,
    tipo: tipo,
  };
}

/**
 * El objetivo de esta API es proveer las funciones necesarias para la construcción de opes e instrucciones.
 */
const instruccionesAPI = {
  /**
   * Crea un nuevo objeto tipo Operación para las opes binarias válidas.
   * @param {*} operandoIzq
   * @param {*} operandoDer
   * @param {*} tipo
   */
  nuevoOpBinaria: function (operandoIzq, operandoDer, tipo) {
    return nuevaOp(operandoIzq, operandoDer, tipo);
  },

  /**
   * Crea un nuevo objeto tipo Operación para las opes unarias válidas
   * @param {*} operando
   * @param {*} tipo
   */
  nuevoOpUnaria: function (operando, tipo) {
    return nuevaOp(operando, undefined, tipo);
  },

  /**
   * Crea un nuevo objeto tipo Valor, esto puede ser una cadena, un número o un identificador
   * @param {*} valor
   * @param {*} tipo
   */
  nuevoValor: function (valor, tipo) {
    return {
      tipo: tipo,
      valor: valor,
    };
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia Imprimir.
   * @param {*} expresionCadena
   */
  nuevoImprimir: function (expresionCadena) {
    return {
      tipo: TIPO_INSTRUCCION.IMPRIMIR,
      expresionCadena: expresionCadena,
    };
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia Mientras.
   * @param {*} expresionLogica
   * @param {*} instrucciones
   */
  nuevoMientras: function (expresionLogica, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.MIENTRAS,
      expresionLogica: expresionLogica,
      instrucciones: instrucciones,
    };
  },

  /**
   * Crea un objeto tipo instrucción para la sentencia Para.
   * @param {*} expresionLogica
   * @param {*} instrucciones
   * @param {*} aumento
   * @param {*} decremento
   */
  nuevoPara: function (
    variable,
    valorVariable,
    expresionLogica,
    aumento,
    instrucciones
  ) {
    return {
      tipo: TIPO_INSTRUCCION.PARA,
      expresionLogica: expresionLogica,
      instrucciones: instrucciones,
      aumento: aumento,
      variable: variable,
      valorVariable: valorVariable,
    };
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia Declaración.
   * @param {*} identificador
   */
  nuevoDeclaracion: function (identificador, tipo) {
    return {
      tipo: TIPO_INSTRUCCION.DECLARACION,
      identificador: identificador,
      tipo_dato: tipo,
    };
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia Asignación.
   * @param {*} identificador
   * @param {*} expresionNumerica
   */
  nuevoAsignacion: function (identificador, expresionNumerica) {
    return {
      tipo: TIPO_INSTRUCCION.ASIGNACION,
      identificador: identificador,
      expresionNumerica: expresionNumerica,
    };
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia If.
   * @param {*} expresionLogica
   * @param {*} instrucciones
   */
  nuevoIf: function (expresionLogica, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.IF,
      expresionLogica: expresionLogica,
      instrucciones: instrucciones,
    };
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia If-Else.
   * @param {*} expresionLogica
   * @param {*} instruccionesIfVerdadero
   * @param {*} instruccionesIfFalso
   */
  nuevoIfElse: function (
    expresionLogica,
    instruccionesIfVerdadero,
    instruccionesIfFalso
  ) {
    return {
      tipo: TIPO_INSTRUCCION.IF_ELSE,
      expresionLogica: expresionLogica,
      instruccionesIfVerdadero: instruccionesIfVerdadero,
      instruccionesIfFalso: instruccionesIfFalso,
    };
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia Switch.
   * @param {*} expresionNumerica
   * @param {*} instrucciones
   */
  nuevoSwitch: function (expresionNumerica, casos) {
    return {
      tipo: TIPO_INSTRUCCION.SWITCH,
      expresionNumerica: expresionNumerica,
      casos: casos,
    };
  },

  /**
   * Crea una lista de casos para la sentencia Switch.
   * @param {*} caso
   */
  nuevoListaCasos: function (caso) {
    var casos = [];
    casos.push(caso);
    return casos;
  },

  /**
   * Crea un objeto tipo OPCION_SWITCH para una CASO de la sentencia switch.
   * @param {*} expresionNumerica
   * @param {*} instrucciones
   */
  nuevoCaso: function (expresionNumerica, instrucciones) {
    return {
      tipo: TIPO_OPCION_SWITCH.CASO,
      expresionNumerica: expresionNumerica,
      instrucciones: instrucciones,
    };
  },
  /**
   * Crea un objeto tipo OPCION_SWITCH para un CASO DEFECTO de la sentencia switch.
   * @param {*} instrucciones
   */
  nuevoCasoDef: function (instrucciones) {
    return {
      tipo: TIPO_OPCION_SWITCH.DEFECTO,
      instrucciones: instrucciones,
    };
  },

  /**
   * Crea un objeto tipo Operador (+ , - , / , *)
   * @param {*} operador
   */
  nuevoOperador: function (operador) {
    return operador;
  },

  /**
   * Crea un objeto tipo Instrucción para la sentencia Asignacion con Operador
   * @param {*} identificador
   * @param {*} operador
   * @param {*} expresionCadena
   */
  nuevoAsignacionSimplificada: function (
    identificador,
    operador,
    expresionNumerica
  ) {
    return {
      tipo: TIPO_INSTRUCCION.ASIGNACION_SIMPLIFICADA,
      operador: operador,
      expresionNumerica: expresionNumerica,
      identificador: identificador,
    };
  },
};
// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OP = TIPO_OP;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;
