//var urlCats = "https://api.thedogapi.com/v1/images/search?limit=8";
var url40imagenes = "https://api.thecatapi.com/v1/images/search?limit=40";
var urlCats = "https://api.thecatapi.com/v1/images/search?limit=8"; //50
var limitURL = "https://api.thecatapi.com/v1/images/search?";
//var urlCategorias = "http://localhost:3000/categorias";
//url para github
var urlCategorias = "https://my-json-server.typicode.com/Gema-de-la-Fuente/Gatos/categorias";

var urlCambioCategoria = urlCats;
var numPagina = 0;


window.onload = function(){
    controlador();
};

async function controlador(){
    infoCategorias = await datos_JSON(urlCategorias);
    arrayFotosPorCategoria = await datos_JSON(url40imagenes);
    datosGatos = await datos_JSON(urlCats);
    listaCategorias();
    imprimir(datosGatos , numPagina, arrayFotosPorCategoria, 0, url40imagenes); 
}

function datos_JSON(url){
    console.log('Funcion datos_JSON');
    return new Promise(function(resolve, reject) {
        var  xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        if(url == urlCats){
            //xhttp.setRequestHeader("x-api-key", "DEMO-API-KEY");
            xhttp.setRequestHeader("x-api-key", "3d11189e-a3bc-43f0-ba7c-a6888f73312a");
        }
        xhttp.responseType = 'json';

        xhttp.onload = function() {
            var status = xhttp.status;
            var readyState = xhttp.readyState;   
            if (status == 200 && readyState==4) {
                resolve(xhttp.response);
            } else {
                reject(status);
            }
        };
        xhttp.send();
    });
} 

function listaCategorias(){
    console.log('Funcion crear categorias');
    console.log(infoCategorias);
    var categoriasInput= document.getElementById("select-categorias"),option;
   
    infoCategorias.forEach(function(categoria) {
        option= document.createElement("option");
        //mejor value de id porque creo que hay que buscar por el id de la categoria en la url
        option.setAttribute("value", categoria.id);
        option.innerHTML= categoria.name;
        categoriasInput.appendChild(option);
    });
    categoriasInput.addEventListener('change', function() {
        var option = this.options[this.selectedIndex].value;
        if(option == "Todas las categorías") {
            urlCambioCategoria = urlCats;
        } else{
            urlCambioCategoria = urlCats + '&category_ids=' + option + '&page=0&order=DESC';
            url40imagenes =limitURL + '&category_ids=' + option + '&limit=40';
        }
        console.log('cambio categoria en la url ' + urlCambioCategoria);
        cambiarFotosCategoria(urlCambioCategoria , 0, url40imagenes , option);

    });
}

//datosGatos , pag , arrayFotosPorCategoria, option , url40imagenes
function imprimir(datos , numPagina, arrayFotosPorCategoria, option, url40imagenes){

    console.log('Funcion imprimir');
    console.log(datos);
    var content = document.getElementById('search-content');
    content.innerHTML = '';

    var numeroImagenes =  datos.length;
    console.log('numeroImagenes '+ numeroImagenes);
    //mostramos un mensaje cuando el array viene vacio
    if (numeroImagenes == 0) {
        var mensaje = document.createElement('p');
        mensaje.textContent = "Categoria sin fotos, seleccione otra";
        mensaje.style.fontSize = "24px";
        mensaje.style.fontWeight = 'bolder';
        mensaje.style.marginTop = "10%";
        mensaje.style.marginBottom = "10%";
        content.appendChild(mensaje);
    } else {

        var tabla = document.createElement('table');
        tabla.classList.add('tabla');
        //0 - 7, 8 - 15, 16 - 23
        //for (var i = (numPagina*8); i < (numPagina*8)+7; i++) {
        for (var i = 0; i < datos.length; i++) {
            var fila = document.createElement('tr');
            tabla.appendChild(fila);

            for (var j =0; j < 4 && i<datos.length; j++) {

                var celda = document.createElement('td'),
                    img = document.createElement('img');
                img.classList.add('fotos');
                img.setAttribute('src', datos[i].url);
                img.setAttribute('alt', datos[i].id);

                celda.appendChild(img);
                fila.appendChild(celda);
                if (j != 3) {
                    i++;  
                } 
            }
        }
        content.appendChild(tabla);

        var paginador = document.createElement('div');
        paginador.setAttribute("class" ,"pagination");
        //numero de paginas calculadas
        //si queremos que cambie el color de la pagina donde estamos añadir class active al enlace

        var enlace = document.createElement('a');
        enlace.textContent = "<<";
        enlace.setAttribute('href', '#');
        enlace.setAttribute('class', 'enlace');
        enlace.setAttribute('id', 'primeraPagina');


        enlace.addEventListener('click', function(){
            var enlaces = paginador.getElementsByClassName('enlace');
            //console.log("<<");
            urlCambioCategoria = urlCats + '&category_ids=' + option + '&page='+0+'&order=DESC';
            cambiarFotosCategoria(urlCambioCategoria, 0, url40imagenes, option); 
        });
        //-----------------------------------------------

        paginador.appendChild(enlace);

        //calculamos el numero de paginas segun el numero de fotos de la categoria
        var numeroPaginas = parseInt((arrayFotosPorCategoria.length-1)/8);

        var enlaces= '';

        for(var i = 0; i<=numeroPaginas; i++){

            var boton = document.createElement('button');
            boton.textContent = i;
            boton.setAttribute('class', 'enlace');
            boton.setAttribute('id', i);
            pag = boton.getAttribute('id');

            paginador.appendChild(boton);
            

            if(i == numPagina){
                boton.setAttribute('class', 'active');
            }

        }

        var botones = paginador.getElementsByTagName('button');
            for(var j = 0; j < botones.length; j += 1) {
                var btn = botones[j];
                var nombreBoton = btn.textContent;
                btn.addEventListener('click', crearManejador(nombreBoton,paginador,option));
                
            }

        enlace = document.createElement('a');
        enlace.textContent = ">>";
        enlace.setAttribute('href', '#');
        enlace.setAttribute('class', 'enlace');

        enlace.addEventListener('click', function(){
            var enlaces = paginador.getElementsByClassName('enlace');
            //console.log(">>");
            urlCambioCategoria = urlCats + '&category_ids=' + option + '&page='+numeroPaginas+'&order=DESC';
            cambiarFotosCategoria(urlCambioCategoria, numeroPaginas, url40imagenes, option); 
        });

      
        paginador.appendChild(enlace);
        content.appendChild(paginador);


    }
}

async function cambiarFotosCategoria(urlCambioCategoria, pag, url40imagenes , option){
    console.log('Funcion actualizar fotos');
    console.log('urlCambioCategorias ' + urlCambioCategoria);
    //la categoria 0 la hemos creado nosotras No existe en la app, asique le ponemos la url sin categoria pero con limit 8
    if(option == 0){
        urlCambioCategoria = urlCats + '&page='+pag+'&order=DESC';
        console.log('urlCategoria 0: ' + urlCambioCategoria);
        datosGatos = await datos_JSON(urlCambioCategoria);
    }else{
        datosGatos = await datos_JSON(urlCambioCategoria);
    }

    if(isNaN(url40imagenes)){
        arrayFotosPorCategoria = await datos_JSON(url40imagenes);
    }else{
        arrayFotosPorCategoria = url40imagenes;
    }

    console.log(arrayFotosPorCategoria.length);
    console.log(datosGatos);
    imprimir(datosGatos , pag , arrayFotosPorCategoria, option , url40imagenes);

}

function eventoEnlace(nombreBoton, paginador, option){

    urlCambioCategoria = urlCats + '&category_ids=' + option + '&page='+nombreBoton+'&order=DESC';
    cambiarFotosCategoria(urlCambioCategoria, nombreBoton, url40imagenes, option);

}


function crearManejador(nombreBoton,paginador,option) {
    return function(){
        //alert(nombreBoton);
        eventoEnlace(nombreBoton,paginador,option);  
    }
}


