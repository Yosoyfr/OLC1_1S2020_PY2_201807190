//Funcion que se encarga de crear nuevos objetos (JSON)
function nuevaOperacion(operandoIzq, tipo, operandoDer) {
  return {
    EXPRESION_IZQ: operandoIzq,
    OPERADOR: tipo,
    EXPRESION_DERECHA: operandoDer,
  };
}

//lISTA DE ERRORES
var Lista_Errores = new Array();
const instruccionesAPI = {
  //Raiz del archivo
  raiz: function (imports, clases) {
    //RAIZ: [{ imports: imports }, { clases: clases }],
    return {
      RAIZ: {
        IMPORTS: imports,
        CLASS: clases,
      },
    };
  },
  //Para los imports
  inicio_imports: function (importaciones, importacion) {
    return {
      IMPORTS: importaciones,
      IMPORT: importacion,
    };
  },
  inst_import: function (identificador) {
    return {
      RESERVADA: "import",
      IDENTIFICADOR: identificador,
      PUNTO_Y_COMA: ";",
    };
  },
  //Para las clases
  inicio_clases: function (clases, clase) {
    return {
      CLASS: clases,
      CLASSP: clase,
    };
  },
  inst_class: function (identificador, instrucciones) {
    return {
      RESERVADA: "class",
      IDENTIFICADOR: identificador,
      BLOQUE_CLASE: {
        LLAVE_APERTURA: "{",
        BLOQUE_CLASEP: instrucciones,
        LLAVE_CIERRE: "}",
      },
    };
  },
  //Para los bloques de instrucciones de las clases
  bloque_class: function (clases, clase) {
    return {
      BLOQUE_CLASEP: clases,
      BLOQUE_CLASEPP: clase,
    };
  },
  //Para los tipos de operaciones con signos
  operacionBinaria: function (expIzq, expDer, tipo) {
    return nuevaOperacion(expIzq, tipo, expDer);
  },
  //Para los tipos de operaciones de un solo signo como (! o -)
  operacionUnaria: function (operando, tipo) {
    return nuevaOperacion(undefined, tipo, operando);
  },
  //Lista de paramettros
  lista_expresiones: function (expresiones, coma, expresion) {
    return {
      PARAMETROS: expresiones,
      COMA: coma,
      EXPRESION: expresion,
    };
  },
  //Para metodos
  inst_metodos: function (identificador, parametros, instrucciones) {
    return {
      METODOS: {
        RESERVADA: "void",
        IDENTIFICADOR: identificador,
        PARENTESIS_APERTURA: "(",
        PARAMETROS: parametros,
        PARENTESIS_CIERRE: ")",
        BLOQUE_METODO: {
          LLAVE_APERTURA: "{",
          INSTRUCCIONES: instrucciones,
          LLAVE_CIERRE: "}",
        },
      },
    };
  },
  //Para Funciones
  inst_funciones: function (tipo, identificador, parametros, instrucciones) {
    return {
      FUNCIONES: {
        TIPO: tipo,
        IDENTIFICADOR: identificador,
        PARENTESIS_APERTURA: "(",
        PARAMETROS: parametros,
        PARENTESIS_CIERRE: ")",
        BLOQUE_FUNCION: {
          LLAVE_APERTURA: "{",
          INSTRUCCIONES: instrucciones,
          LLAVE_CIERRE: "}",
        },
      },
    };
  },
  //Lista de paramettros
  lista_parametros: function (parametros, coma, parametro) {
    return {
      PARAMETROS: parametros,
      COMA: coma,
      PARAMETRO: parametro,
    };
  },
  //Parametros de una funcion o metodo
  parametro: function (tipo, id) {
    return {
      TIPO: tipo,
      IDENTIFICADOR: id,
    };
  },
  //Para las instrucciones
  bloque_instrucciones: function (instrucciones, instruccion) {
    return {
      INSTRUCCIONES: instrucciones,
      INSTRUCCION: instruccion,
    };
  },
  //Para la sentencia imprimir
  inst_print: function (expresion) {
    return {
      PRINT: {
        RESERVADA: "System.out.println",
        PARENTESIS_APERTURA: "(",
        EXPRESION: expresion,
        PARENTESIS_CIERRE: ")",
        PUNTO_Y_COMA: ";",
      },
    };
  },
  //Para la sentencia while
  inst_while: function (condicion, instrucciones) {
    return {
      WHILE: {
        RESERVADA: "while",
        CONDICION: condicion,
        BLOQUE_INSTRUCCIONES: {
          LLAVE_APERTURA: "{",
          INSTRUCCIONES: instrucciones,
          LLAVE_CIERRE: "}",
        },
      },
    };
  },
  //Para la sentencia do-while
  inst_do_while: function (instrucciones, condicion) {
    return {
      DO_WHILE: {
        RESERVADA: "do",
        BLOQUE_INSTRUCCIONES: {
          LLAVE_APERTURA: "{",
          INSTRUCCIONES: instrucciones,
          LLAVE_CIERRE: "}",
        },
        WHILE: "while",
        CONDICION: condicion,
        PUNTO_Y_COMA: ";",
      },
    };
  },
  //Para la sentencia do-while
  inst_for: function (
    declaracion,
    asignacion,
    expresion,
    modificacion,
    instrucciones
  ) {
    return {
      FOR: {
        RESERVADA: "for",
        PARENTESIS_APERTURA: "(",
        DECLARACION: declaracion,
        ASIGNACION: asignacion,
        EXPRESION: expresion,
        PUNTO_Y_COMA: ";",
        MODIFICADORES_VAR: modificacion,
        PARENTESIS_CIERRE: ")",
        BLOQUE_INSTRUCCIONES: {
          LLAVE_APERTURA: "{",
          INSTRUCCIONES: instrucciones,
          LLAVE_CIERRE: "}",
        },
      },
    };
  },
  //Modificador del ciclo for
  modificador_For: function (modificadores, coma, modificador) {
    return {
      MODIFICADORES_VAR: modificadores,
      COMA: coma,
      MODIFICADOR_VAR: modificador,
    };
  },
  //Modificacion de variables
  inst_modificacion: function (identificador, asignacion) {
    return {
      IDENTIFICADOR: identificador,
      ASIGNACION: asignacion,
    };
  },
  //Bloque de declaraciones
  bloque_declaraciones: function (tipo, listaVariables) {
    return {
      DECLARACION: {
        TIPO: tipo,
        DECLARACIONP: listaVariables,
        PUNTO_Y_COMA: ";",
      },
    };
  },
  //Para las distintas asignaciones
  bloque_declaracionesP: function (declap, coma, declapp) {
    return {
      DECLARACIONP: declap,
      COMA: coma,
      DECLARACIONPP: declapp,
    };
  },
  //Para declaracion de variables
  inst_declaracion: function (identificador, asignacion, expresion) {
    return {
      IDENTIFICADOR: identificador,
      ASIGNACION: asignacion,
      EXPRESION: expresion,
    };
  },
  //Para la asignacion de variables
  inst_asignacion: function (id, asignacion, expresion) {
    return {
      ASIGNACION_VARIABLE: {
        IDENTIFICADOR: id,
        ASIGNACION: asignacion,
        EXPRESION: expresion,
        PUNTO_Y_COMA: ";",
      },
    };
  },
  //Para la llamada de funciones
  llamada_funciones: function (identificador, parametros, p) {
    return {
      LLAMADA_DE_FUNCION: {
        IDENTIFICADOR: identificador,
        PARENTESIS_APERTURA: "(",
        PARAMETROS: parametros,
        PARENTESIS_CIERRE: ")",
        PUNTO_Y_COMA: p,
      },
    };
  },
  //Inicio de una instruccion if
  inicio_if: function (cuerpo) {
    return {
      IF: cuerpo,
    };
  },
  //Para la sentecia if
  inst_if: function (condicion, instrucciones, else_if, else_) {
    return {
      RESERVADA: "if",
      CONDICION: condicion,
      BLOQUE_INSTRUCCIONES: {
        LLAVE_APERTURA: "{",
        INSTRUCCIONES: instrucciones,
        LLAVE_CIERRE: "}",
      },
      ELSE_IF: else_if,
      ELSE: else_,
    };
  },
  //Para las condiciones
  condicion: function (expresion) {
    return {
      PARENTESIS_APERTURA: "(",
      EXPRESION: expresion,
      PARENTESIS_CIERRE: ")",
    };
  },
  //Para los else_if
  inst_else_if: function (if_) {
    return {
      RESERVADA: "else",
      IF: if_,
    };
  },
  //Para la sentencia else
  inst_else: function (instrucciones) {
    return {
      RESERVADA: "else",
      BLOQUE_INSTRUCCIONES: {
        LLAVE_APERTURA: "{",
        INSTRUCCIONES: instrucciones,
        LLAVE_CIERRE: "}",
      },
    };
  },
  //Para la sentencia switch
  inst_switch: function (condicion, casos) {
    return {
      SWITCH: {
        RESERVADA: "switch",
        CONDICION: condicion,
        LLAVE_APERTURA: "{",
        CASOS: casos,
        LLAVE_CIERRE: "}",
      },
    };
  },
  //Para la lista de casos en la sentencia switch
  listaCasos: function (casos, caso) {
    return {
      CASOS: casos,
      CASO: caso,
    };
  },
  //Casos que iran en la lista de casos o el default
  caso: function (reservada, expresion, instrucciones) {
    return {
      RESERVADA: reservada,
      EXPRESION: expresion,
      DOS_PUNTOS: ":",
      INSTRUCCIONES: instrucciones,
    };
  },
  //Para los continue
  continues: function () {
    return {
      CONTINUE: {
        RESERVADA: "continue",
        PUNTO_Y_COMA: ";",
      },
    };
  },
  //Para los break
  breaks: function () {
    return {
      BREAK: {
        RESERVADA: "break",
        PUNTO_Y_COMA: ";",
      },
    };
  },
  //Para los return
  returns: function (expresion) {
    return {
      RETURN: {
        RESERVADA: "return",
        EXPRESION: expresion,
        PUNTO_Y_COMA: ";",
      },
    };
  },
  //Para los errores
  errorLS: function (tipo, esperado, encontrado, linea, columna) {
    return {
      TIPO: tipo,
      ESPERADO: esperado,
      ENCONTRADO: encontrado,
      LINEA: linea,
      COLUMNA: columna,
    };
  },
  //Setear la lista de Errores
  setLista: function () {
    Lista_Errores = new Array();
  },
  //Setear la lista de Errores
  getLista: function () {
    return Lista_Errores;
  },
  //Pushear la lista
  pushLista: function (element) {
    Lista_Errores.push(element);
  },
};

module.exports.instruccionesAPI = instruccionesAPI;
