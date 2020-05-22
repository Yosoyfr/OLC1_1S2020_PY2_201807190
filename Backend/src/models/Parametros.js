const parametro = class Parametro {
  /**
   *
   * @param {String} tipo - Tipo de la variable
   * @param {String} identificador - Identificador de la variable
   */
  constructor(tipo, identificador) {
    this.tipo = tipo;
    this.identificador = identificador;
  }
};

module.exports.parametro = parametro;
