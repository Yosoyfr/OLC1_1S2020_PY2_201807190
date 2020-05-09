// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
  IMPORT: "INST_IMPORT",
  CLASS: "INST_CLASS",
  DECLARACION: "INST_DECLARACION",
  ASIGNACION: "INST_ASIGANCION",
  METODOS: "INST_METODOS",
  PARAMETROS: "PARAMS",
  IF: "INST_IF",
  ELSE_IF: "INST_ELSE_IF",
  ELSE: "INST_ELSE",
  SWITCH: "INST_SWITCH",
  DO_WHILE: "INST_DOWHILE",
  WHILE: "INST_WHILE",
  FOR: "INST_FOR",
  PRINT: "INST_PRINT",
  LLAMADA_FUNCIONES: "INST_FUNCIONES",
  BREAK: "INST_BREAK",
  RETURN: "INST_RETURN",
  CONTINUE: "INST_PRINT",
};

// Constantes para los tipos de 'valores (Expresiones)' que reconoce nuestra gramática.
const TIPO_VALOR = {
  NUMERO: "V_NUMERO",
  IDENTIFICADOR: "V_IDENTIFICADOR",
  CADENA: "V_CADENA",
  CARACTER: "V_CARACTER",
  LOGICO: "V_LOGICO",
  FUNCION: "V_FUNCION",
};

// Constantes para los tipos de 'operaciones' que soporta nuestra gramática.
const TIPO_OPERACION = {
  SUMA: "OP_SUMA",
  RESTA: "OP_RESTA",
  MULTIPLICACION: "OP_MULTIPLICACION",
  DIVISION: "OP_DIVISION",
  MODULO: "OP_MODULO",
  POTENCIA: "OP_POTENCIA",
  NEGATIVO: "OP_NEGATIVO",
  NOT: "OP_NOT",
  AND: "OP_AND",
  OR: "OP_OR",
  IGUALDAD: "OP_IGUALDAD",
  DISTINTO: "OP_DISTINTO",
  MAYOR_IGUAL_QUE: "OP_MAYOR_IGUAL_QUE",
  MENOR_IGUAL_QUE: "OP_MENOR_IGUAL_QUE",
  MAYOR_QUE: "OP_MAYOR_QUE",
  MENOR_QUE: "OP_MENOR_QUE",
};

// Constantes para los tipos de opciones en un switch validas en la gramática
const TIPO_OPCION_SWITCH = {
  CASE: "CASE",
  DEFAULT: "DEFAULT",
};

//Funcion que se encarga de crear nuevos objetos (JSON)
function nuevaOperacion(operandoIzq, operandoDer, tipo) {
  return {
    operandoIzq: operandoIzq,
    operandoDer: operandoDer,
    tipo: tipo,
  };
}

const instruccionesAPI = {
  //Para los imports
  inst_import: function (identificador) {
    return {
      tipo: TIPO_INSTRUCCION.IMPORT,
      identificador: identificador,
    };
  },
  //Para las clases
  inst_class: function (identificador, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.CLASS,
      identificador: identificador,
      instrucciones: instrucciones,
    };
  },
  //Para los tipos de operaciones con signos
  operacionBinaria: function (operandoIzq, operandoDer, tipo) {
    return nuevaOperacion(operandoIzq, operandoDer, tipo);
  },
  //Para los tipos de operaciones de un solo signo como (! o -)
  operacionUnaria: function (operando, tipo) {
    return nuevaOperacion(operando, undefined, tipo);
  },
  //Para los valores como cadena, caracter, numero o logico
  valor: function (valor, tipo) {
    return {
      tipo: tipo,
      valor: valor,
    };
  },
  //Para metodos
  inst_metodos: function (identificador, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.METODOS,
      identificador: identificador,
      instrucciones: instrucciones,
    };
  },
  //Para la lista de parametso
  listaParametros: function (parametro) {
    var params = [];
    params.push(parametro);
    return params;
  },
  //Casos que iran en la lista de casos o el default
  parametro: function (tipo, id) {
    return {
      tipo: TIPO_INSTRUCCION.PARAMETROS,
      tipo_dato: tipo,
      identificador: id,
    };
  },
  //Para la sentencia imprimir
  inst_print: function (expresion) {
    return {
      tipo: TIPO_INSTRUCCION.PRINT,
      expresion: expresion,
    };
  },
  //Para la sentencia while
  inst_while: function (expresion, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.WHILE,
      expresion: expresion,
      instrucciones: instrucciones,
    };
  },
  //Para declaracion de variables
  inst_declaracion: function (id, tipo, expresion) {
    if (expresion === undefined) {
      return {
        tipo: TIPO_INSTRUCCION.DECLARACION,
        identificador: id,
        tipo_dato: tipo,
      };
    } else {
      return {
        tipo: TIPO_INSTRUCCION.DECLARACION,
        tipo_dato: tipo,
        identificador: id,
        expresion: expresion,
      };
    }
  },
  //Para la asignacion de variables
  inst_asignacion: function (id, expresion) {
    return {
      tipo: TIPO_INSTRUCCION.ASIGNACION,
      identificador: id,
      expresion: expresion,
    };
  },
  //Para la sentecia if
  inst_if: function (expresion, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.IF,
      expresion: expresion,
      instrucciones: instrucciones,
    };
  },
  //Para la sentecia else-if
  inst_elseif: function (expresion, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.ELSE_IF,
      expresion: expresion,
      instrucciones: instrucciones,
    };
  },
  //Para la sentencia else
  inst_else: function (instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.ELSE,
      instrucciones: instrucciones,
    };
  },
  //Para la sentencia switch
  inst_switch: function (expresion, casos) {
    return {
      tipo: TIPO_INSTRUCCION.SWITCH,
      expresion: expresion,
      casos: casos,
    };
  },
  //Para la lista de casos en la sentencia switch
  listaCasos: function (caso) {
    var casos = [];
    casos.push(caso);
    return casos;
  },
  //Casos que iran en la lista de casos o el default
  caso: function (tipo, expresion, instrucciones) {
    if (tipo === 0) {
      tipo = TIPO_OPCION_SWITCH.CASE;
    } else {
      tipo = TIPO_OPCION_SWITCH.DEFAULT;
    }
    return {
      tipo: tipo,
      expresion: expresion,
      instrucciones: instrucciones,
    };
  },
  //Para los tipos de operadores admitidos en las expresiones como +, -, *. /, etc
  operadores: function (operador) {},
};

// Exportamos nuestras constantes y nuestra API
module.exports.TIPO_OPEARACION = TIPO_OPERACION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
