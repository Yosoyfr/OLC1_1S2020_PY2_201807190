//Archivos abiertos en las pestañas
var Archivos_Abiertos = [];
//Proceso para la lectura de archivos
function leerArchivoA(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function (e) {
    var contenido = e.target.result;
    mostrarContenido(contenido, archivo.name, 1);
  };
  lector.readAsText(archivo);
}

function leerArchivoB(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function (e) {
    var contenido = e.target.result;
    mostrarContenido(contenido, archivo.name, 2);
  };
  lector.readAsText(archivo);
}

function mostrarContenido(contenido, name, type) {
  //Creamos la pestaña
  if (type === 1) {
    addNewTabA();
    //Seleccionamos el texto de la pestaña seleccionada
    let editor = ace.edit("txtA" + (tabsA - 1));
    //Le asignamos lo leido
    editor.getSession().setValue(contenido);
    //Guardamos en nuestra lista de archivos abiertos
    addFilesOpen("txtA" + (this.tabsA - 1), name);
  } else {
    addNewTabB();
    //Seleccionamos el texto de la pestaña seleccionada
    let editor = ace.edit("txtB" + (this.tabsB - 1));
    //Le asignamos lo leido
    editor.getSession().setValue(contenido);
    //Guardamos en nuestra lista de archivos abiertos
    addFilesOpen("txtB" + (this.tabsB - 1), name);
  }
}

//Funcion para añadir a la lista de tokens
function addFilesOpen(tab, nombre) {
  Archivos_Abiertos.push({
    Tab: tab,
    Nombre: nombre,
  });
}

//Le asignamos el metodo al boton de abrir
const openDocsA = document.getElementById("file-inputA");
openDocsA.addEventListener("change", leerArchivoA, false);
const openDocsB = document.getElementById("file-inputB");
openDocsB.addEventListener("change", leerArchivoB, false);

//Proceso para guardar archivos
function saveFiles(select_Tab) {
  if (select_Tab != "") {
    let existFile = false;
    let aux_Nombre = "";
    for (let i = 0; i < Archivos_Abiertos.length; i++) {
      if (select_Tab === Archivos_Abiertos[i].Tab) {
        existFile = true;
        aux_Nombre = Archivos_Abiertos[i].Nombre;
      }
    }
    //Seleccionamos el texto de la pestaña seleccionada
    let editor = ace.edit(select_Tab);
    let value_Txt = editor.getSession().getValue();
    if (existFile) {
      saveDocument(value_Txt, aux_Nombre);
    } else {
      if (select_Tab === select_TabA) {
        $("#modal-saveA").modal("show");
      } else {
        $("#modal-saveB").modal("show");
      }
    }
  }
}

//Proceso guardar como
function SaveAsA() {
  let aux_Nombre = document.getElementById("nombre-fileA").value;
  let editor = ace.edit(select_TabA);
  let value_Txt = editor.getSession().getValue();
  saveDocument(value_Txt, aux_Nombre);
  $("#modal-saveA").modal("hide");
  document.getElementById("nombre-fileA").value = "text.java";
}

function SaveAsB() {
  let aux_Nombre = document.getElementById("nombre-fileB").value;
  let editor = ace.edit(select_TabB);
  let value_Txt = editor.getSession().getValue();
  saveDocument(value_Txt, aux_Nombre);
  $("#modal-saveB").modal("hide");
  document.getElementById("nombre-fileB").value = "text.java";
}

function saveDocument(value_Txt, aux_Nombre) {
  let file = new File([value_Txt], aux_Nombre, {
    type: "text/plain;charset=utf-8",
  });
  // obtienes una URL para el fichero que acabas de crear
  var url = window.URL.createObjectURL(file);
  // creas un enlace y lo añades al documento
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  // actualizas los parámetros del enlace para descargar el fichero creado
  a.href = url;
  a.download = file.name;
  a.onclick = destroyClickedElement;
  a.click();
  window.URL.revokeObjectURL(url);
}

function destroyClickedElement(event) {
  // remove the link from the DOM
  document.body.removeChild(event.target);
}

//Funcion para abrir archivos en el navegador
function openFiles(file) {
  // obtienes una URL para el fichero que acabas de crear
  var url = window.URL.createObjectURL(file);
  window.open(url, "Download");
}

//Editor para el documento A
var tabsA = 1;
function addNewTabA() {
  var self = this;
  var addTab = document.getElementById("addTabIconA");
  //Obtenemos el div donde se encuentras las referencias de los tabs
  let tabs_Content = document.getElementById("myTabContentA");
  insertTab(self, this.tabsA, tabs_Content, addTab, "txtA", "EditorA");
  //Sumamos uno mas al valor de pestañas
  this.tabsA++;
}

//Editor para el documento B
var tabsB = 1;
function addNewTabB() {
  var self = this;
  var addTab = document.getElementById("addTabIconB");
  //Obtenemos el div donde se encuentras las referencias de los tabs
  let tabs_Content = document.getElementById("myTabContentB");
  insertTab(self, this.tabsB, tabs_Content, addTab, "txtB", "EditorB");
  //Sumamos uno mas al valor de pestañas
  this.tabsB++;
}

//Funciones para agregar una nueva pestaña a un editor
function insertTab(self, nTab, tabs_Content, addTab, name, reference) {
  //Creamos el nuevo item
  let item = document.createElement("li");
  item.setAttribute("class", "nav-item");
  //Nombre de la pestaña
  let nameTab = document.createTextNode("Pestañas " + nTab);
  //Creamos la referencia de se item
  let reference_Item = document.createElement("a");
  reference_Item.setAttribute("class", "nav-link");
  reference_Item.setAttribute("data-toggle", "tab");
  reference_Item.setAttribute("href", "#" + reference + nTab);
  reference_Item.setAttribute("onclick", "changeTab('" + name + nTab + "')");
  reference_Item.appendChild(nameTab);
  item.appendChild(reference_Item);
  //Boton para cerrar la pestaña
  var deletaTab = document.createElement("span");
  deletaTab.className = "fa fa-times";
  deletaTab.addEventListener(
    "click",
    function (event) {
      self.deleteTab(deletaTab);
    },
    false
  );
  //Le asinamos un linkeable al boton de cerrar la pestaña
  var referenceDelete = document.createElement("a");
  referenceDelete.href = "#";
  referenceDelete.appendChild(deletaTab);
  reference_Item.appendChild(referenceDelete);
  //Creamos el contenido del tab
  let new_Tab = document.createElement("div");
  new_Tab.setAttribute("class", "tab-pane fade");
  new_Tab.setAttribute("id", reference + nTab);
  //Creamos el textArea del tab
  let new_TextArea = document.createElement("div");
  new_TextArea.setAttribute("class", "list-group");
  new_TextArea.setAttribute("style", "height: 400px; position: relative;");
  new_TextArea.setAttribute("id", name + nTab);
  //Le agremaos el text area al tab
  new_Tab.appendChild(new_TextArea);
  //Le agremas el tab al div de tabs
  tabs_Content.appendChild(new_Tab);
  //Creamos el editor de texto
  let editor = ace.edit(name + nTab);
  editor.setTheme("ace/theme/dracula");
  editor.session.setMode("ace/mode/java");
  editor.setFontSize("14px");
  //Se le asigna un atributo de contenido de la tab, para referenciar que tab se va a eliminar
  item.contentTab = reference + nTab;
  //Agregamos el nuevo iten al nav de tabs
  addTab.parentNode.insertBefore(item, addTab);
}

//Proceso para borrar la ventana
function deleteTab(tab) {
  while (tab.nodeName != "LI") {
    tab = tab.parentNode;
  }
  document
    .getElementById(tab.contentTab)
    .parentNode.removeChild(document.getElementById(tab.contentTab));
  tab.parentNode.removeChild(tab);
}

//Seleccion de pestaña
var select_TabA = "";
var select_TabB = "";
//Funcion para cambiar la pestaña seleccionada
function changeTab(id) {
  if (id.includes("A")) {
    select_TabA = id;
  } else if (id.includes("B")) {
    select_TabB = id;
  }
}

async function run() {
  //Seleccionamos el texto de la pestaña seleccionada
  let editorA = ace.edit(select_TabA);
  let editorB = ace.edit(select_TabB);
  //Obtenemos el texto
  let value_TxtA = editorA.getSession().getValue();
  let value_TxtB = editorB.getSession().getValue();

  const copias = await postCopy(value_TxtA, value_TxtB);
  //Mostrar los metodos en el frontend
  let Metodos_HTML_Original = "";
  let Metodos_HTML_Copia = "";
  const Lista_de_Metodos = copias.COPIAS.METODOS;
  const tabla_Original = document.getElementById("div-originales");
  const tabla_Copia = document.getElementById("div-copias");
  tabla_Original.innerHTML = "";
  tabla_Copia.innerHTML = "";
  Lista_de_Metodos.forEach((metodo, i) => {
    Metodos_HTML_Original += `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start active"><div class="d-flex w-100 justify-content-between"> <h5 class="mb-1">Nombre del Metodo: ${metodo.METODO_ORIGINAL.identificador}</h5><small>Clase que pertenece: ${metodo.METODO_ORIGINAL.clase}</small></div><span>Lista de Parametros</span>`;
    if (metodo.METODO_ORIGINAL.parametros.length === 0) {
      Metodos_HTML_Original += "<br>";
    }
    metodo.METODO_ORIGINAL.parametros.forEach((parametro) => {
      Metodos_HTML_Original += `<p class="mb-1">Parametro => Tipo: ${parametro.tipo} - ID: ${parametro.identificador}</p>`;
    });

    Metodos_HTML_Original += `<small>Tipo de Retorno: ${metodo.METODO_ORIGINAL.tipo}</small></a>`;

    Metodos_HTML_Copia += `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"> <h5 class="mb-1">Nombre del Metodo: ${metodo.METODO_COPIA.identificador}</h5><small>Clase que pertenece: ${metodo.METODO_COPIA.clase}</small></div><span>Lista de Parametros</span>`;
    if (metodo.METODO_COPIA.parametros.length === 0) {
      Metodos_HTML_Copia += "<br>";
    }
    metodo.METODO_COPIA.parametros.forEach((parametro) => {
      Metodos_HTML_Copia += `<p class="mb-1">Parametro => Tipo: ${parametro.tipo} - ID: ${parametro.identificador}</p>`;
    });

    Metodos_HTML_Copia += `<small>Tipo de Retorno: ${metodo.METODO_COPIA.tipo}</small></a>`;
  });
  tabla_Original.innerHTML = Metodos_HTML_Original;
  tabla_Copia.innerHTML = Metodos_HTML_Copia;

  //Mostrar las clases en frontend
  let Clases_HTML = "";
  const Lista_de_Clases = copias.COPIAS.CLASES;
  const tabla_Clases = document.getElementById("tabla-clases");
  tabla_Clases.innerHTML = "";
  Lista_de_Clases.forEach((clase, i) => {
    Clases_HTML += `<tr class="table-info">
                  <th scope="row">${i + 1}</th>
                  <td> ${clase.CLASE_ORIGINAL.nombre} </td>
                  <td> ${clase.CLASE_ORIGINAL.metodos} </td>
                </tr>`;
  });
  tabla_Clases.innerHTML = Clases_HTML;
}

//Funcion POST hacia el servidor
async function postCopy(ori, cop) {
  url = "http://localhost:3000/copias";
  const data = { original: ori, copia: cop };
  const copias = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("Success:", response.message);
      return response;
    });
  return copias;
}

//Geracion del treeview apartir del arbol AST que me devuelve la peticion al servidor
var jsonObj = {};
var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());

//Funcion para parsear el texto y convertirlo en un formato JSON
var setJSON = function (valueJSON) {
  try {
    jsonObj = JSON.parse(valueJSON);
  } catch (err) {
    alert(err);
  }
};

//Funcion POST hacia el servidor
async function postData(txt) {
  url = "http://localhost:3000/parser";
  const data = { text: txt };
  const ast = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("Success:", response.message);
      return response;
    });
  return ast;
}

//Funcion para enviarle el texto del editor al parser en node
function getCodeA() {
  if (select_TabA !== "") {
    getCode(select_TabA);
  }
}

function getCodeB() {
  if (select_TabB !== "") {
    getCode(select_TabB);
  }
}

//funcion para mostrar arbol ast
async function getCode(select_Tab) {
  //Seleccionamos el texto de la pestaña seleccionada
  let editor = ace.edit(select_Tab);
  //Obtenemos el texto
  let value_Txt = editor.getSession().getValue();
  if (value_Txt !== (undefined || "")) {
    //Le enviamos el archivo de texto para que sea parseado por nuestro analizador en el backend
    const analisis = await postData(value_Txt);
    //Recibimos el AST
    setJSON(analisis.AST);
    jsonViewer.showJSON(jsonObj);
    //Recibimos los errores
    let Lista_de_Errores_HTML = "";
    const Lista_de_Errores = JSON.parse(analisis.ERRORES);
    const tabla_Errores = document.getElementById("tabla-errores");
    tabla_Errores.innerHTML = "";
    for (let i = 0; i < Lista_de_Errores.length; i++) {
      if (Lista_de_Errores[i].TIPO === "Lexico") {
        Lista_de_Errores_HTML =
          '<tr class="table-warning">\n' +
          '<th scope="row">' +
          (i + 1) +
          "</th>\n" +
          "<td>" +
          Lista_de_Errores[i].LINEA +
          "</td>\n" +
          "<td>" +
          Lista_de_Errores[i].COLUMNA +
          "</td>\n" +
          "<td>" +
          Lista_de_Errores[i].TIPO +
          "</td>\n" +
          "<td>" +
          "El lexema '" +
          Lista_de_Errores[i].ENCONTRADO +
          "' no pertenece al lenguaje." +
          "</td>\n" +
          "</tr>";
      } else {
        Lista_de_Errores_HTML =
          '<tr class="table-danger">\n' +
          '<th scope="row">' +
          (i + 1) +
          "</th>\n" +
          "<td>" +
          Lista_de_Errores[i].LINEA +
          "</td>\n" +
          "<td>" +
          Lista_de_Errores[i].COLUMNA +
          "</td>\n" +
          "<td>" +
          Lista_de_Errores[i].TIPO +
          "</td>\n" +
          "<td>" +
          "Se esperaba '" +
          Lista_de_Errores[i].ESPERADO +
          "', (Se encontro " +
          Lista_de_Errores[i].ENCONTRADO +
          ")." +
          "</td>\n" +
          "</tr>";
      }
      tabla_Errores.innerHTML = Lista_de_Errores_HTML;
    }
  } else {
    jsonViewer.showJSON(null);
  }
}

//Carga el codigo en el editor de texto
const loadCodeA = document.querySelector("#btn-analisis-a");
loadCodeA.addEventListener("click", getCodeA);
const loadCodeB = document.querySelector("#btn-analisis-b");
loadCodeB.addEventListener("click", getCodeB);
