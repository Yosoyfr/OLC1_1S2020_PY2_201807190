/**
 * Ejemplo Intérprete Sencillo con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%lex

%options case-sensitive

%%

\s+											// Espacios en blanco
"//".*										// Comentario de linea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// Comentario multilina

//Tipos de datos
"int"			return 'RINT';
"double"			return 'RDOUBLE';
"boolean"			return 'RBOOLEAN';
"char"			return 'RCHAR';
"String"			return 'RSTRING';

//Palabras reservadas 
"true"							return "RTRUE";
"false"							return "RFALSE";
"if"				return 'RIF';
"else"				return 'RELSE';
"switch"			return 'RSWITCH';
"case"				return 'RCASE';
"default"			return 'RDEFAULT';
"break"				return 'RBREAK';
"while"				return 'RWHILE';
"do"				return 'RDO';
"for"				return 'RFOR';
"continue"				return 'RCONTINUE';
"return"				return 'RRETURN';
"System.out.println"	return "RPRINT";
"System.out.print"		return "RPRINT";
"class"			return 'RCLASS';
"import"			return 'RIMPORT';
"main"			return 'RMAIN';
"void"			return 'RVOID';

//Operaciones aritmeticas
"++"				return 'INCREMENTO';
"+"					return 'SUMA';
"--"				return 'DECREMENTO';
"-"					return 'RESTA';
"*"					return 'MULTIPLICACION';
"/"					return 'DIVISION';
"^"					return 'POTENCIA';
"%"					return 'MODULO';

//Operciones relaciones
"=="				return 'IGUALDAD';
"!="				return 'DISTINTO';
">="				return 'MAYORIGUALQUE';
">"					return 'MAYORQUE';
"<="				return 'MENORIGUALQUE';
"<"					return 'MENORQUE';

//Operaciones logicas
"&&"				return 'AND'
"||"				return 'OR';
"!"					return 'NOT';

//Simbolos del lenguaje
"{"					return 'LLAVEIZQUIERDA';
"}"					return 'LLAVEDERECHA';
"("					return 'PARENTESISIZQUIERDO';
")"					return 'PARENTESISDERECHO';
";"					return 'PUNTOYCOMA';
","					return 'COMA';
"="					return 'IGUAL';
":"					return 'DOSPUNTOS';

//TIPOS DE EXPRESIONES YA SEAN NUMERICAS, CADENAS DE TEXTO, CARACTERES O IDENTIFICADORES
\"([^\\\"]|\\.)*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'([^\\\"]|\\.)\'				{ yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }
[0-9]+("."[0-9]+)?\b  	return 'NUMERO';
([a-zA-Z_])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex

%{
	const TIPO_OPERACION = require("../Instrucciones/intrucciones").TIPO_OPEARACION;
	const TIPO_VALOR 		= require("../Instrucciones/intrucciones").TIPO_VALOR;
	const instruccionesAPI	= require("../Instrucciones/intrucciones").instruccionesAPI;
%}
/* Asociación de operadores y precedencia */

%left 'AND' 'OR'
%left 'IGUALDAD' 'DISTINTO'
%left 'MENORQUE' 'MENORIGUALQUE' 'MAYORQUE' 'MAYORIGUALQUE'
%left 'SUMA' 'RESTA'
%left 'MULTIPLICACION' 'DIVISION'
%left 'POTENCIA' 'MODULO'
%left UMENOS
%right 'NOT'
%right 'INCREMENTO' 'DECREMENTO'

%start INICIO

%% /* Definición de la gramática */

//Metodo de inicio de la gramatica
// cuado se haya reconocido la entrada completa retornamos el AST
INICIO
	: EOF
	| IMPORTS CLASS EOF {return instruccionesAPI.raiz($1, $2);}
	| CLASS EOF {return instruccionesAPI.raiz(undefined, $1);}
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;

//Imports de clases
IMPORTS 
	: IMPORTS RIMPORT IMPORT { $1.push($3); $$ = $1; }
	| RIMPORT IMPORT { $$ = [$2]; }
	;

IMPORT
	:IDENTIFICADOR PUNTOYCOMA { $$ = instruccionesAPI.inst_import($1); }
	|error PUNTOYCOMA { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
	;

//Metodo para el analisis de clases
CLASS
	: CLASS CLASSP { $1.push($2); $$ = $1; }
	| CLASSP { $$ = [$1]; }
	;

CLASSP
	: RCLASS IDENTIFICADOR BLOQUE_CLASE { $$ = instruccionesAPI.inst_class($2, $3); }
	;

//Bloque de una clase identificada { Instrucciones }
BLOQUE_CLASE
	: LLAVEIZQUIERDA BLOQUE_CLASEP LLAVEDERECHA { $$ = [$2]; }
	| LLAVEIZQUIERDA LLAVEDERECHA { $$ = undefined; }
	;

BLOQUE_CLASEP
	: BLOQUE_CLASEP BLOQUE_CLASEPP { $1.push($2); $$ = $1; }
	| BLOQUE_CLASEPP { $$ = [$1]; }
	;

BLOQUE_CLASEPP
	: DECLARACION { $$ = $1; }
	| METODOS { $$ = $1; }
	;

//Metodos que pueden venir adentro del bloque de una clase
METODOS
	: TIPO IDENTIFICADOR ASIGNACIONPARAMETROS BLOQUE_METODO { $$ = instruccionesAPI.inst_funciones($1, $2, $3, $4); }
	| RVOID IDENTIFICADOR ASIGNACIONPARAMETROS BLOQUE_METODO { $$ = instruccionesAPI.inst_metodos($2, $3, $4); }
	| RVOID RMAIN PARENTESISIZQUIERDO PARENTESISDERECHO BLOQUE_METODO { $$ = instruccionesAPI.inst_metodos($2, undefined, $5); }
	;

//Bloque de instrucciones en un metodo
BLOQUE_METODO
	:	LLAVEIZQUIERDA INSTRUCCIONES LLAVEDERECHA { $$ = $2; }
	|	LLAVEIZQUIERDA  LLAVEDERECHA { $$ = undefined; }
	;

//Asignacion de parametros que puede o no tener un metodo o funcion
ASIGNACIONPARAMETROS
	: PARENTESISIZQUIERDO LISTAPARAMETROS PARENTESISDERECHO { $$ = $2; }
	| PARENTESISIZQUIERDO PARENTESISDERECHO { $$ = undefined; }
	;

LISTAPARAMETROS
	: LISTAPARAMETROS COMA PARAMETROS { $1.push($3); $$ = $1; }
	| PARAMETROS { $$ = [$1]; }
	;

PARAMETROS
	: TIPO IDENTIFICADOR { $$ = instruccionesAPI.parametro($1, $2); }
	;

// Metodo de instrucciones
INSTRUCCIONES
	: INSTRUCCIONES INSTRUCCION { $1.push($2); $$ = $1; }
	| INSTRUCCION	{ $$ = [$1]; }
;

//Posibles instrucciones como if-else, switch, while, do-while, for, llamadas a funciones, print, etc.
INSTRUCCION
	: IF { $$ = $1; }
	| SWITCH { $$ = $1; }
	| WHILE { $$ = $1; }
	| DO_WHILE { $$ = $1; }
	| FOR { $$ = $1; }
	| LLAMADAFUNCIONES { $$ = $1; }
	| BREAK { $$ = $1; }
	| RETURN { $$ = $1; }
	| CONTINUE { $$ = $1; }
	| PRINT { $$ = $1; }
	| DECLARACION { $$ = $1; }
	| ASIGNACION { $$ = $1; }
	| error PUNTOYCOMA { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
	;

//Instruccion print
PRINT
	:RPRINT PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO PUNTOYCOMA { $$ = instruccionesAPI.inst_print($3); }
	;

//Instruccion declaracion de variables
DECLARACION 
	: TIPO DECLARACIONP PUNTOYCOMA { $$ = instruccionesAPI.inst_declaracion($1, $2); }
	;

DECLARACIONP 
	: DECLARACIONP COMA DECLARACIONPP { $1.push($3); $$ = $1; }
	| DECLARACIONPP { $$ = [$1]; }
	;

DECLARACIONPP
	: IDENTIFICADOR IGUAL EXPRESION { $$ = instruccionesAPI.asignacion_declaracion($1, $3); }
	| IDENTIFICADOR { $$ = instruccionesAPI.asignacion_declaracion($1, undefined); }
	;

//Instruccion asignacion de variables
ASIGNACION 
	: IDENTIFICADOR IGUAL EXPRESION PUNTOYCOMA { $$ = instruccionesAPI.inst_asignacion($1, $3); }
	| INC_DEC PUNTOYCOMA { $$ = $1; }
;

// Incremetento o decremento de variables a++ o a--
INC_DEC 
	: IDENTIFICADOR INCREMENTO { $$ = instruccionesAPI.inst_asignacion($1, $2); }
	| IDENTIFICADOR DECREMENTO { $$ = instruccionesAPI.inst_asignacion($1, $2); }
;

//Tipos de variables admitidos en el lenguaje
TIPO 
	: RINT { $$ = $1; }
  | RDOUBLE { $$ = $1; }
  | RBOOLEAN { $$ = $1; }
	| RSTRING { $$ = $1; }
	| RCHAR { $$ = $1; }
;

//Expresiones 
EXPRESION 
	: RESTA EXPRESION %prec UMENOS	{ $$ = instruccionesAPI.operacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
	|	NOT EXPRESION	{ $$ = instruccionesAPI.operacionUnaria($2, TIPO_OPERACION.NOT); }
  | EXPRESION SUMA EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
  | EXPRESION RESTA EXPRESION	{ $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
  | EXPRESION MULTIPLICACION EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }
  | EXPRESION DIVISION EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
	| EXPRESION MODULO EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.MODULO); }
	| EXPRESION POTENCIA EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.POTENCIA); }
	| EXPRESION AND EXPRESION	{ $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.AND); }
	| EXPRESION OR EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.OR); }
	| EXPRESION IGUALDAD EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.IGUALDAD); }
	| EXPRESION DISTINTO EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.DISTINTO); }
	| EXPRESION MENORIGUALQUE EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.MENOR_IGUAL_QUE); }
	| EXPRESION MENORQUE EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.MENOR_QUE); }
	| EXPRESION MAYORIGUALQUE EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.MAYOR_IGUAL_QUE); }
	| EXPRESION MAYORQUE EXPRESION { $$ = instruccionesAPI.operacionBinaria($1, $3, TIPO_OPERACION.MAYOR_QUE); }
	| PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO { $$ = $2 }
	| NUMERO { $$ = instruccionesAPI.valor(Number($1), TIPO_VALOR.NUMERO); }
  | RTRUE { $$ = instruccionesAPI.valor($1, TIPO_VALOR.LOGICO); }
  | RFALSE { $$ = instruccionesAPI.valor($1, TIPO_VALOR.LOGICO); }
  | CADENA { $$ = instruccionesAPI.valor($1, TIPO_VALOR.CADENA); }
	| CARACTER { $$ = instruccionesAPI.valor($1, TIPO_VALOR.CARACTER); }
  | IDENTIFICADOR PARENTESISIZQUIERDO LISTAEXPRESIONES PARENTESISDERECHO { $$ = instruccionesAPI.valor(instruccionesAPI.llamada_funciones($1, $3), TIPO_VALOR.FUNCION); }
	| IDENTIFICADOR PARENTESISIZQUIERDO PARENTESISDERECHO { $$ = instruccionesAPI.valor(instruccionesAPI.llamada_funciones($1, []), TIPO_VALOR.FUNCION); }
	| IDENTIFICADOR { $$ = instruccionesAPI.valor($1, TIPO_VALOR.IDENTIFICADOR); }
  ;	

//Metodo para llamadas a funcioens identificador(ListaExpresiones);
LLAMADAFUNCIONES
	:IDENTIFICADOR PARENTESISIZQUIERDO LISTAEXPRESIONES PARENTESISDERECHO PUNTOYCOMA { $$ = instruccionesAPI.llamada_funciones($1, $3); }
	|IDENTIFICADOR PARENTESISIZQUIERDO PARENTESISDERECHO PUNTOYCOMA { $$ = instruccionesAPI.llamada_funciones($1, []); }
	;

LISTAEXPRESIONES
	:LISTAEXPRESIONES COMA EXPRESION { $1.push($3); $$ = $1; }
	|EXPRESION { $$ = [$1]; }
	;

//Sentrencia if-else
IF 
	: RIF CONDICION BLOQUE_INSTRUCCIONES { $$ = instruccionesAPI.inst_if($2, $3, []); }
  | RIF CONDICION BLOQUE_INSTRUCCIONES RELSE BLOQUE_INSTRUCCIONES { $$ = instruccionesAPI.inst_if($2, $3, [instruccionesAPI.inst_else($5)]); }
	| RIF CONDICION BLOQUE_INSTRUCCIONES RELSE IF { $$ = instruccionesAPI.inst_if($2, $3, [$5]); }
	;

//Sentencia switch
SWITCH
	:RSWITCH PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO LLAVEIZQUIERDA CASES LLAVEDERECHA { $$ = instruccionesAPI.inst_switch($3, $6); }
	;

//Casos del switch
CASES
	:CASES CASE_EVALUAR {$1.push($2); $$ = $1;}
	|CASE_EVALUAR { $$ = [$1];}
	;

CASE_EVALUAR
	:RCASE EXPRESION DOSPUNTOS INSTRUCCIONES { $$ = instruccionesAPI.caso(0, $2, $4); }
	|RCASE EXPRESION DOSPUNTOS { $$ = instruccionesAPI.caso(0, $2, undefined); }
	|RDEFAULT DOSPUNTOS INSTRUCCIONES { $$ = instruccionesAPI.caso(1, undefined, $3); }
	|RDEFAULT DOSPUNTOS { $$ = instruccionesAPI.caso(1, undefined, undefined); }
	;

//Condiciones 
CONDICION 
	: PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO	{ $$ = $2; }
	;

//Bloque de instrucciones para un algunas istrucciones
BLOQUE_INSTRUCCIONES 
	: LLAVEIZQUIERDA INSTRUCCIONES LLAVEDERECHA  { $$ = $2; }
	| LLAVEIZQUIERDA  LLAVEDERECHA { $$ = undefined; }
  ;

//Sentencia while
WHILE
	: RWHILE CONDICION BLOQUE_INSTRUCCIONES { $$ = instruccionesAPI.inst_while($2, $3); }
	;

//Sentencia Do-while
DO_WHILE
	: RDO BLOQUE_INSTRUCCIONES RWHILE CONDICION PUNTOYCOMA { $$ = instruccionesAPI.inst_do_while($4, $2); }
	;

//Sentencia for
FOR
	: RFOR PARENTESISIZQUIERDO DECLARACION EXPRESION PUNTOYCOMA FORINC_DEC PARENTESISDERECHO BLOQUE_INSTRUCCIONES { $$ = instruccionesAPI.inst_for($3, $4, $6, $7); }
	| RFOR PARENTESISIZQUIERDO DECLARACIONP PUNTOYCOMA EXPRESION PUNTOYCOMA FORINC_DEC PARENTESISDERECHO BLOQUE_INSTRUCCIONES  { $$ = instruccionesAPI.inst_for($3, $5, $7, $9); }
	;

FORINC_DEC
	: FORINC_DEC COMA INC_DEC {$1.push($3); $$ = $1;}
	| INC_DEC { $$ = [$1];}
	;

//Sentencia return
RETURN
  : RRETURN EXPRESION PUNTOYCOMA { $$ = instruccionesAPI.returns($2); }
  | RRETURN PUNTOYCOMA { $$ = instruccionesAPI.returns(undefined); }
  ;

//Sentencia break
BREAK
  : RBREAK PUNTOYCOMA { $$ = instruccionesAPI.breaks(); }
  ;

//Sentencia continue
CONTINUE
  : RCONTINUE PUNTOYCOMA { $$ = instruccionesAPI.continues(); }
  ;