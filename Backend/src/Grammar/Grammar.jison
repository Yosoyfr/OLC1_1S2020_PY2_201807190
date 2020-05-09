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
INICIO
	: EOF
	| IMPORTS CLASS EOF
	| CLASS EOF
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;

// Metodo de instrucciones
INSTRUCCIONES
	: INSTRUCCIONES INSTRUCCION 	
	| INSTRUCCION					
;

//Posibles instrucciones como if-else, switch, while, do-while, for, llamadas a funciones, print, etc.
INSTRUCCION
	: IF
	| SWITCH
	| WHILE
	| DO_WHILE
	| FOR
	| LLAMADAFUNCIONES
	| BREAK
	| RETURN
	| CONTINUE
	| PRINT
	| DECLARACION
	| ASIGNACION   
	| error PUNTOYCOMA { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
	;

//Imports de clases
IMPORTS 
	: IMPORTS RIMPORT IMPORT 
	| RIMPORT IMPORT 
	;

IMPORT
	:IDENTIFICADOR PUNTOYCOMA
	|error PUNTOYCOMA { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
	;

//Metodo para el analisis de clases
CLASS
	: CLASS CLASSP
	| CLASSP
	;

CLASSP
	: RCLASS IDENTIFICADOR BLOQUE_CLASE
	;

//Bloque de una clase identificada { Instrucciones }
BLOQUE_CLASE
	: LLAVEIZQUIERDA BLOQUE_CLASEP LLAVEDERECHA
	| LLAVEIZQUIERDA LLAVEDERECHA
	;

BLOQUE_CLASEP
	: BLOQUE_CLASEP BLOQUE_CLASEPP 
	| BLOQUE_CLASEPP
	;

BLOQUE_CLASEPP
	: DECLARACION
	| METODOS
	;

//Metodos que pueden venir adentro del bloque de una clase
METODOS
	: TIPOMETODO BLOQUE_METODO
	;

//Bloque de instrucciones en un metodo
BLOQUE_METODO
	:	LLAVEIZQUIERDA INSTRUCCIONES LLAVEDERECHA
	|	LLAVEIZQUIERDA  LLAVEDERECHA
	;

//Definicion del tipo de metodo o ya sea una funcion
TIPOMETODO
	: TIPO IDENTIFICADOR ASIGNACIONPARAMETROS
	| RVOID IDENTIFICADOR ASIGNACIONPARAMETROS
	| RVOID RMAIN PARENTESISIZQUIERDO PARENTESISDERECHO
	;

//Asignacion de parametros que puede o no tener un metodo o funcion
ASIGNACIONPARAMETROS
	: PARENTESISIZQUIERDO LISTAPARAMETROS PARENTESISDERECHO
	| PARENTESISIZQUIERDO PARENTESISDERECHO
	;

LISTAPARAMETROS
	: LISTAPARAMETROS COMA PARAMETROS
	| PARAMETROS
	;

PARAMETROS
	: TIPO IDENTIFICADOR
	;

//Instruccion print
PRINT
	:RPRINT PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO PUNTOYCOMA
	;

//Instruccion declaracion de variables
DECLARACION 
	: TIPO DECLARACIONP PUNTOYCOMA
	;

DECLARACIONP 
	: DECLARACIONP COMA DECLARACIONPP
	| DECLARACIONPP
	;

DECLARACIONPP
	: IDENTIFICADOR IGUAL EXPRESION
	| IDENTIFICADOR 
	;

//Instruccion asignacion de variables
ASIGNACION 
	: IDENTIFICADOR IGUAL EXPRESION PUNTOYCOMA
	| INC_DEC PUNTOYCOMA
;

// Incremetento o decremento de variables a++ o a--
INC_DEC 
	: IDENTIFICADOR INCREMENTO
	| IDENTIFICADOR DECREMENTO
;

//Tipos de variables admitidos en el lenguaje
TIPO 
	: RINT
  | RDOUBLE
  | RBOOLEAN
	| RSTRING
	| RCHAR
;

//Expresiones 
EXPRESION 
	: RESTA EXPRESION %prec UMENOS	
	|	NOT EXPRESION	
  | EXPRESION SUMA EXPRESION		  
  | EXPRESION RESTA EXPRESION		    
  | EXPRESION MULTIPLICACION EXPRESION		    
  | EXPRESION DIVISION EXPRESION	
	| EXPRESION MODULO EXPRESION	
	| EXPRESION POTENCIA EXPRESION	
	| EXPRESION AND EXPRESION	
	| EXPRESION OR EXPRESION	
	| EXPRESION IGUALDAD EXPRESION	
	| EXPRESION DISTINTO EXPRESION	
	| EXPRESION MENORIGUALQUE EXPRESION	
	| EXPRESION MENORQUE EXPRESION	
	| EXPRESION MAYORIGUALQUE EXPRESION	
	| EXPRESION MAYORQUE EXPRESION	
	| NUMERO	 				    
  | RTRUE				    
  | RFALSE				    
  | CADENA			    
	| CARACTER			    
  | IDENTIFICADOR PARENTESISIZQUIERDO LISTAEXPRESIONES PARENTESISDERECHO
	| IDENTIFICADOR PARENTESISIZQUIERDO PARENTESISDERECHO
	| IDENTIFICADOR
  | PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO		  
  ;	

//Metodo para llamadas a funcioens identificador(ListaExpresiones);
LLAMADAFUNCIONES
	:IDENTIFICADOR PARENTESISIZQUIERDO LISTAEXPRESIONES PARENTESISDERECHO PUNTOYCOMA
	|IDENTIFICADOR PARENTESISIZQUIERDO PARENTESISDERECHO PUNTOYCOMA
	;

LISTAEXPRESIONES
	:LISTAEXPRESIONES COMA EXPRESION
	|EXPRESION
	;

//Sentrencia if-else
IF 
	: RIF CONDICION BLOQUE_INSTRUCCIONES
  | RIF CONDICION BLOQUE_INSTRUCCIONES RELSE BLOQUE_INSTRUCCIONES
	| RIF CONDICION BLOQUE_INSTRUCCIONES RELSE IF
	;

//Sentencia switch
SWITCH
	:RSWITCH PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO LLAVEIZQUIERDA CASES LLAVEDERECHA
	;

//Casos del switch
CASES
	:CASES CASE_EVALUAR
	|CASE_EVALUAR
	;

CASE_EVALUAR
	:RCASE EXPRESION DOSPUNTOS INSTRUCCIONES
	|RCASE EXPRESION DOSPUNTOS 
	|RDEFAULT DOSPUNTOS INSTRUCCIONES
	|RDEFAULT DOSPUNTOS 
	;

//Condiciones 
CONDICION 
	: PARENTESISIZQUIERDO EXPRESION PARENTESISDERECHO	
	;

//Bloque de instrucciones para un algunas istrucciones
BLOQUE_INSTRUCCIONES 
	: LLAVEIZQUIERDA INSTRUCCIONES LLAVEDERECHA 
	| LLAVEIZQUIERDA  LLAVEDERECHA 
  ;

//Sentencia while
WHILE
	: RWHILE CONDICION BLOQUE_INSTRUCCIONES
	;

//Sentencia Do-while
DO_WHILE
	: RDO BLOQUE_INSTRUCCIONES RWHILE CONDICION PUNTOYCOMA
	;

//Sentencia for
FOR
	: RFOR PARENTESISIZQUIERDO DECLARACION  EXPRESION PUNTOYCOMA FORINC_DEC PARENTESISDERECHO BLOQUE_INSTRUCCIONES
	| RFOR PARENTESISIZQUIERDO DECLARACIONP PUNTOYCOMA EXPRESION PUNTOYCOMA FORINC_DEC PARENTESISDERECHO BLOQUE_INSTRUCCIONES
	;

FORINC_DEC
	: FORINC_DEC COMA INC_DEC 	
	| INC_DEC					
	;

//Sentencia return
RETURN
  : RRETURN EXPRESION PUNTOYCOMA
  | RRETURN PUNTOYCOMA
  ;

//Sentencia break
BREAK
  : RBREAK PUNTOYCOMA
  ;

//Sentencia continue
CONTINUE
  : RCONTINUE PUNTOYCOMA
  ;