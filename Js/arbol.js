// Recupera campos de texto del Form 
let numNodos = document.getElementById("n_nodos").value;
let numHijos = document.getElementById("n_nodos").value - 1;
let numPadres = document.getElementById("nodos_p").value;
let amplitud= document.getElementById("amplitud").value;
let profundidad = document.getElementById("profundidad").value;
let meta;
let busqueda;
//Recupera información del  canvas 
let canvas = document.getElementById('main-canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth*(2/3); 
canvas.height = window.innerHeight;
//Variables auxiliares
let nivel = 0;
let nodosPadresFaltantes = numPadres;
let cont = 0;
//Colores para los niveles 
let colores = [
    "red", "gold","green","darkturquoise","pink","gray","purple",
    "brown","blue","lemonchiffon","olive","lime","red","gold","green",
    "orange","darkturquoise","pink","gray","purple","brown","blue",
    "lemonchiffon","olive","lime"
  ];
//ID para los nodos 
  let ids = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z","AA","AB","AC","AD"
  ];
//Arreglo de Nodos 
let nodos = []; 
let conectores = [];
let recorrido = [];

function ejecutar(){
    let flag = validarCampos();
    if (flag == true) {
        crearNodos();
        crearConectores();
        dibujarConector();
        dibujarNodo();
        
    }
}

function llenarCampoHijos(){
    numNodos = document.getElementById("n_nodos").value;
    document.getElementById("nodos_h").value = numNodos-1;
}

//Validaciones para los campos del Form 
function validarCampos(){
    amplitud= document.getElementById("amplitud").value;
    profundidad = document.getElementById("profundidad").value;
    numNodos = document.getElementById("n_nodos").value;
    numPadres = document.getElementById("nodos_p").value;
    nodosPadresFaltantes = numPadres; 

    //nodos totales maximos
    let nodosMax = ((profundidad-1)*amplitud)+1;
    document.getElementById("n_nodos").max = nodosMax;
    if (numNodos > 30){ 
        alert ("Este programa soporta a lo mucho 30 nodos");
        LimpiarCampos();
        return false;
    } 
    if(numNodos > nodosMax) {
        alert ("Tu número de nodos es muy grande para esa amplitud y profundidad");
        LimpiarCampos();
        return false;
    }
    //nodos padres maximos 
    let padresMax=0;
    for (let i=1 ; i<=amplitud; i++){
        padresMax = padresMax + (profundidad-i);
    }
    document.getElementById("nodos_p").max = padresMax;
    /*if (padresMax < numPadres) {
        alert("Tienes muchos padres");
        return false;
    }*/
    return true;
}

//Limpiar Campos del Form 
function LimpiarCampos(){
    document.getElementById("n_nodos").value = 0;
    document.getElementById("nodos_h").value = 0;
    document.getElementById("nodos_p").value = 0;
    document.getElementById("amplitud").value = 0;
    document.getElementById("profundidad").value = 0;
    //Limpia canvas 
    nodos = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Nodos
function Nodo(idNodo,padre,x,y,nivel){
    this.idNodo = idNodo;
    this.padre = padre;
    this.hijos = [];
    this.x = x;
    this.y = y;
    this.nivel = nivel;
    this.color = colores[nivel];
    if(nivel == 0){
        this.raiz = true;
    }else{
        this.raiz = false;
    }
    this.meta = false;
    this.explorado =false;
}

//Crear Nodos 
function crearNodos(){
    let x; 
    let y;
    let nRaiz
    //Nodo Raiz (nivel 0)
    if(nivel == 0){
        x = (canvas.width-200)/2;
        y = 50;
        nRaiz = new Nodo(ids[cont],null,x,y,nivel);
        cont ++;
        nivel ++;
        nodos.push(nRaiz);
    } 
    while (cont < numNodos) {
        while (nivel < (profundidad)) {
            x = (distribucionX()*(nodosPorNivel(nivel)))+100;
            y = (distribucionY()*(nivel+.5));
            let nodo;
            if(nivel == 1){
                nodo = new Nodo(ids[cont],nRaiz,x,y,nivel);
                nRaiz.hijos.push(nodo);
            }else{
                let index = asignarPadre();
                if(index != -1){
                    nivel = nodos[index].nivel+1;
                    x = (distribucionX()*(nodosPorNivel(nivel)))+100;
                    y = (distribucionY()*(nivel+.5));
                    nodo = new Nodo(ids[cont],nodos[index],x,y,nodos[index].nivel+1);
                    nodos[index].hijos.push(nodo);
                }else{
                    break;
                }
            }
            cont ++;
            nivel ++;
            nodos.push(nodo);
        }
        if(nivel == profundidad || nivel > profundidad){
            nivel = 1;
        }
    }
}

function distribucionX(){
    let disX = (canvas.width-200)/amplitud;
    return disX;
}

function distribucionY(){
    let disY = (canvas.height)/profundidad;
    return disY;
}

function nodosPorNivel(nvl){
    let nodosNivel=0;
    for (let i = 0; i < nodos.length; i++) {
        if(nodos[i].nivel == nvl){
            nodosNivel++;
        }
    }
    return nodosNivel;
}

function asignarPadre(){
    padresF();
    if (nodosPadresFaltantes > 0) {
        for (let i = 0; i < nodos.length; i++) {
            if(nodos[i].nivel != (profundidad-1)){
                if (nodos[i].hijos.length == 0) {
                    return i;
                }
            }
        }
    } else if (nodos.length < numNodos && nodosPadresFaltantes <= 0){
        for (let i = 0; i < profundidad; i++) {
            let aux = nodosPorNivel(i+1);
            if (aux < amplitud) {
                return ultimoNodoNievel(i);
            }
        }
    }else{
        return -1;
    }
}

function padresF(){
    let padresActuales=0;
    for (let i = 0; i < nodos.length; i++) {
        if (nodos[i].hijos.length != 0) {
            padresActuales++;
        }  
    }
    nodosPadresFaltantes= numPadres-padresActuales;
}

function ultimoNodoNievel(nvl){
    for (let i = nodos.length-1 ; i >= 0; i--) {
        if(nodos[i].nivel == nvl){
            if(nodos[i].hijos.length != 0){
                return i;
            }  
        }
    }
}

function dibujarNodo(){
    for (let i = 0; i < nodos.length; i++) {
        let x = nodos[i].x;
        let y = nodos[i].y;
        let rx=25;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = "12px Montserrat";
        ctx.fillText(nodos[i].idNodo, x - rx / 4, y);
        ctx.strokeStyle = nodos[i].color;
        ctx.lineWidth = 4;
        ctx.stroke();
    } 
}

function Conector(nodo1, nodo2) {
    this.nodo1 = nodo1;
    this.nodo2 = nodo2;
}

function crearConectores(){
    for (let j = 0; j < nodos.length; j++) {
        if(nodos[j].hijos.length != 0){
            for (let i = 0; i < nodos[j].hijos.length; i++) {
                if (typeof nodos[j].hijos[i]  != "undefined") {
                    let conector = new Conector(nodos[j],nodos[j].hijos[i]);
                    conectores.push(conector);
                }
            }  
        }
    }
}

function dibujarConector() {
    for (let i = 0; i < conectores.length; i++) {
        ctx.beginPath();
        ctx.moveTo(conectores[i].nodo1.x, conectores[i].nodo1.y);
        ctx.lineTo(conectores[i].nodo2.x, conectores[i].nodo2.y);
        ctx.stroke();     
    }
}

function buscar(){
    
    let flag = false;
    meta = document.getElementById("meta").value;
    busqueda = document.getElementById("busqueda").value;
    switch (busqueda) {
        //Amplitud
        case "1":
            for (let i = 0; i < profundidad; i++) {
                for (let j = 0; j < nodos.length; j++) {
                    if (nodos[j].nivel == i) {
                        if (nodos[j].idNodo == meta) {
                            recorrido.push(nodos[j].idNodo);
                            nodos[j].meta=true;
                            flag = true;
                            break;
                        }else{
                            recorrido.push(nodos[j].idNodo);
                        }
                    }
                }
                if(flag == true){
                    break;
                }
            }
            imprimirRecorrido(recorrido);
            break;
        case "2":
            recorrido.push(nodos[0].idNodo);
            nodos[0].explorado = true;
            if(nodos[0].hijos.length != 0){
                for(let i = 0; i <nodos[0].hijos.length; i++ ){
                    if(nodos[0].hijos[i].idNodo != meta){
                        if (nodos[0].hijos[i].explorado == false) {
                            recorrido.push(nodos[0].hijos[i].idNodo);
                            nodos[0].hijos[i].explorado = true;
                                explorar(nodos[0].hijos[i]);
                        }
                    }else{
                        recorrido.push(nodos[0].hijos[i].idNodo);
                        imprimirRecorrido(recorrido);
                        break;
                    } 
                }
            }
            break;
        default:
            alert("Seleccione un tipo de busqueda");
            break;
    }
}

function imprimirRecorrido(rec){
    let p = document.getElementById("rec");
    for (let i = 0; i < rec.length; i++) {
        p.textContent += " "+rec[i];
    }
}

function explorar(n){
    if(n.hijos.length != 0){
        for(let i = 0; i <n.hijos.length; i++ ){
            if(n.hijos[i].idNodo != meta){
                if (n.hijos[i].explorado == false) {
                    recorrido.push(n.hijos[i].idNodo);
                    n.hijos[i].explorado = true;
                    explorar(n.hijos[i]);
                }
            }else{
                recorrido.push(n.hijos[i].idNodo);
                imprimirRecorrido(recorrido);
                break;
            }
        }
    }
}