const clase = class Clase {
  /**
   * Constructor del objeto clase
   * @param {String} nombre - nombre de la clase
   */
  constructor(nombre) {
    this.nombre = nombre;
    this.metodos = new Array();
  }

  /**
   * Funcion para retornar el nombre de la clase
   */
  getName() {
    return this.nombre;
  }

  /**
   * Funcion que retorna la lista de metodos encontrados
   */
  getMetodos() {
    return this.metodos;
  }

  /**
   *Funcion para agregar metodos a la lista de metodos de la clase
   * @param {String} metodo - Nombre del metodo
   */
  addMetodo(metodo) {
    this.metodos.push(metodo);
  }

  /**
   * Funcion para verificar si la clase tiene el mismo
   * nombre que la clase a verificar
   * @param {String} nombre - nombre a acomparar
   */
  equalsName(nombre) {
    return this.nombre.match(nombre);
  }
};

module.exports.clase = clase;
