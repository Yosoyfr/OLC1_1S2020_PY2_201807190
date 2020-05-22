const metodo = class Metodo {
  /**
   *
   * @param {String} tipo - Tipo del metodo (Void o primitivo)
   * @param {String} identificador - identificador del metodo
   * @param {List} parametros - Lista de parametros en el metodo
   * @param {String} clase -identificador de la clase al que pertene el metodo
   */
  constructor(tipo, identificador, clase) {
    this.tipo = tipo;
    this.identificador = identificador;
    this.parametros = [];
    this.clase = clase;
  }

  /**
   * Retorna el tipo del metodo
   */
  getTipo() {
    return this.tipo;
  }

  /**
   * Retorna el identificador del metodo
   */
  getIdentificador() {
    return this.identificador;
  }

  /**
   * Retorna los parametros del metodo
   */
  getParametros() {
    return this.parametros;
  }

  /**
   * Retorna la clase a la que pertenece este metodo
   */
  getClase() {
    return this.clase;
  }

  /**
   * Añade un nuevo parametro a la lista de parametros de este metodo
   * @param {Parametro} param - Objeto tipo parametro
   */
  addParam(param) {
    this.parametros.push(param);
  }
};

module.exports.metodo = metodo;
