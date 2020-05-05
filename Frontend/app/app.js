//Archivos abiertos en las pestañas
var Archivos_Abiertos = [];
//Proceso para la lectura de archivos
function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function (e) {
    var contenido = e.target.result;
    mostrarContenido(contenido, archivo.name);
  };
  lector.readAsText(archivo);
}

function mostrarContenido(contenido, name) {
  //Creamos la pestaña
  addWindow();
  //Seleccionamos el texto de la pestaña seleccionada
  let editor = ace.edit("txt" + (ctrl_Tabs - 1));
  //Le asignamos lo leido
  editor.getSession().setValue(contenido);
  //Guardamos en nuestra lista de archivos abiertos
  addFilesOpen("txt" + (ctrl_Tabs - 1), name);
}

//Funcion para añadir a la lista de tokens
function addFilesOpen(tab, nombre) {
  Archivos_Abiertos.push({
    Tab: tab,
    Nombre: nombre,
  });
}

//Le asignamos el metodo al boton de abrir
const openDocs = document.getElementById("file-input");
openDocs.addEventListener("change", leerArchivo, false);

//Proceso para guardar archivos
function saveFiles() {
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
    $("#modal-save").modal("show");
  }
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

//Proceso guardar como
function SaveAs() {
  let aux_Nombre = document.getElementById("nombre-file").value;
  let editor = ace.edit(select_Tab);
  let value_Txt = editor.getSession().getValue();
  saveDocument(value_Txt, aux_Nombre);
  $("#modal-save").modal("hide");
  document.getElementById("nombre-file").value = "text.cs";
}

//Funcion para abrir archivos en el navegador
function openFiles(file) {
  // obtienes una URL para el fichero que acabas de crear
  var url = window.URL.createObjectURL(file);
  window.open(url, "Download");
}

//Proceso de las creacion de ventanas
var ctrl_Tabs = 2;

function addWindow() {
  //Obtenemos la lista donde iran los items (tabs)
  let tabs = document.getElementById("myTabs");
  //Obtenemos el div donde se encuentras las referencias de los tabs
  let tabs_Content = document.getElementById("myTabContent");

  //Creamos el nuevo item
  let item = document.createElement("li");
  item.setAttribute("class", "nav-item");

  //Nombre de la pestaña
  let aux_T = document.createTextNode("Pestaña " + ctrl_Tabs);

  //Creamos la referencia de se item
  let reference_Item = document.createElement("a");
  reference_Item.setAttribute("class", "nav-link");
  reference_Item.setAttribute("data-toggle", "tab");
  reference_Item.setAttribute("href", "#p" + ctrl_Tabs);
  reference_Item.setAttribute("onclick", "changeTab('txt" + ctrl_Tabs + "')");
  reference_Item.appendChild(aux_T);
  item.appendChild(reference_Item);

  //Creamos el contenido del tab
  let new_Tab = document.createElement("div");
  new_Tab.setAttribute("class", "tab-pane fade");
  new_Tab.setAttribute("id", "p" + ctrl_Tabs);

  //Creamos el textArea del tab
  let new_TextArea = document.createElement("div");
  new_TextArea.setAttribute("class", "list-group");
  new_TextArea.setAttribute("style", "height: 330px; position: relative;");
  new_TextArea.setAttribute("id", "txt" + ctrl_Tabs);

  //Le agremaos el text area al tab
  new_Tab.appendChild(new_TextArea);
  //Le agremas el tab al div de tabs
  tabs_Content.appendChild(new_Tab);

  //Agregamos a la lista de ventanas
  tabs.appendChild(item);

  //Creamos el editor de texto
  let editor = ace.edit("txt" + ctrl_Tabs);
  editor.setTheme("ace/theme/cobalt");
  editor.session.setMode("ace/mode/csharp");
  editor.setFontSize("14px");
  //Sumamos una mas
  ctrl_Tabs++;
}

function addTable() {
  //Obtenemos la tabla
  let table = document.getElementById("table_var");
  for (let i = 0; i < ListaVariables.length; i++) {
    //Creamos el nuevo renglon
    let tr = document.createElement("tr");
    tr.setAttribute("class", "table-active");
    //Creamos las divisiones
    //Tipo
    let aux_Tipo = document.createTextNode(ListaVariables[i].Tipo);
    let th_Tipo = document.createElement("th");
    th_Tipo.setAttribute("scope", "row");
    th_Tipo.appendChild(aux_Tipo);
    //Nombre
    let aux_Nombre = document.createTextNode(ListaVariables[i].Identificador);
    let td_Nombre = document.createElement("td");
    td_Nombre.appendChild(aux_Nombre);
    //Linea
    let aux_Linea = document.createTextNode(ListaVariables[i].Fila);
    let td_Linea = document.createElement("td");
    td_Linea.appendChild(aux_Linea);
    //Le agremamos cada division al renglon
    tr.appendChild(th_Tipo);
    tr.appendChild(td_Nombre);
    tr.appendChild(td_Linea);
    //Añadimos el renglon a la tabla
    table.appendChild(tr);
  }
}

//Seleccion de pestaña
var select_Tab = "txt1";
//Funcion para cambiar la pestaña seleccionada
function changeTab(id) {
  select_Tab = id;
}
