// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
  IMPORT: "INSTRUCCION_IMPORT",
  CLASS: "INSTRUCCION_CLASS",
  DECLARACION: "INSTRUCCION_DECLARACION",
  ASIGNACION: "INSTRUCCION_ASIGANCION",
  METODOS: "METODO",
  FUNCION: "FUNCION",
  PARAMETROS: "PARAMETRO",
  IF: "INSTRUCCION_IF",
  ELSE: "INSTRUCCION_ELSE",
  SWITCH: "INSTRUCCION_SWITCH",
  DO_WHILE: "INSTRUCCION_DO_WHILE",
  WHILE: "INSTRUCCION_WHILE",
  FOR: "INSTRUCCION_FOR",
  PRINT: "INSTRUCCION_PRINT",
  LLAMADA_FUNCIONES: "LLAMADA_A_FUNCION",
  BREAK: "INSTRUCCION_BREAK",
  RETURN: "INSTRUCCION_RETURN",
  CONTINUE: "INSTRUCCION_CONTINUE",
};

// Constantes para los tipos de 'valores (Expresiones)' que reconoce nuestra gramática.
const TIPO_VALOR = {
  NUMERO: "VALOR_NUMERO",
  IDENTIFICADOR: "VALOR_IDENTIFICADOR",
  CADENA: "VALOR_CADENA",
  CARACTER: "VALOR_CARACTER",
  LOGICO: "VALOR_LOGICO",
  FUNCION: "VALOR_FUNCION",
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
    operacion: tipo,
  };
}

const instruccionesAPI = {
  //Raiz del archivo
  raiz: function (imports, clases) {
    //RAIZ: [{ imports: imports }, { clases: clases }],
    return {
      imports: imports,
      clases: clases,
    };
  },
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
  inst_metodos: function (identificador, parametros, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.METODOS,
      identificador: identificador,
      parametros: parametros,
      instrucciones: instrucciones,
    };
  },
  //Para Funciones
  inst_funciones: function (tipo, identificador, parametros, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.FUNCION,
      tipo_funcion: tipo,
      identificador: identificador,
      parametros: parametros,
      instrucciones: instrucciones,
    };
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
  //Para la sentencia do-while
  inst_do_while: function (expresion, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.DO_WHILE,
      expresion: expresion,
      instrucciones: instrucciones,
    };
  },
  //Para la sentencia do-while
  inst_for: function (variables, expresion, modificacion, instrucciones) {
    return {
      tipo: TIPO_INSTRUCCION.FOR,
      variables: variables,
      expresion: expresion,
      modificacionesVar: modificacion,
      instrucciones: instrucciones,
    };
  },
  //Para declaracion de variables
  inst_declaracion: function (tipo, asignacion) {
    let declaraciones = [];
    asignacion.forEach((element) => {
      if (element.expresion === undefined) {
        declaraciones.push({
          tipo_dato: tipo,
          identificador: element.id,
        });
      } else {
        declaraciones.push({
          tipo_dato: tipo,
          identificador: element.id,
          expresion: element.expresion,
        });
      }
    });
    return {
      tipo: TIPO_INSTRUCCION.DECLARACION,
      declaraciones: declaraciones,
    };
  },
  //Para la asignacion de las declaraciones
  asignacion_declaracion: function (id, expresion) {
    return {
      id: id,
      expresion: expresion,
    };
  },
  //Para la asignacion de variables
  inst_asignacion: function (id, expresion) {
    return {
      tipo: TIPO_INSTRUCCION.ASIGNACION,
      identificador: id,
      expresion: expresion,
    };
  },
  //Para la llamada de funciones
  llamada_funciones: function (identificador, parametros) {
    return {
      tipo: TIPO_INSTRUCCION.LLAMADA_FUNCIONES,
      identificador: identificador,
      parametros: parametros,
    };
  },
  //Para la sentecia if
  inst_if: function (expresion, instrucciones, alternativas) {
    return {
      tipo: TIPO_INSTRUCCION.IF,
      expresion: expresion,
      instrucciones: instrucciones,
      alternativas: alternativas,
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
  //Para los continue
  continues: function () {
    return {
      tipo: TIPO_INSTRUCCION.CONTINUE,
    };
  },
  //Para los break
  breaks: function () {
    return {
      tipo: TIPO_INSTRUCCION.BREAK,
    };
  },
  //Para los return
  returns: function (valor) {
    return {
      tipo: TIPO_INSTRUCCION.RETURN,
      valor: valor,
    };
  },
};

// Exportamos nuestras constantes y nuestra API
module.exports.TIPO_OPEARACION = TIPO_OPERACION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
