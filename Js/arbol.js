// Recupera campos de texto del Form 
let numNodos = document.getElementById("n_nodos").value;
let numHijos = document.getElementById("n_nodos").value - 1;
let numPadres = document.getElementById("nodos_p").value;
let amplitud= document.getElementById("amplitud").value;
let profundidad = document.getElementById("profundidad").value;
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
    "red", "gold","green","orange","darkturquoise","pink","gray","purple",
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

//Validaciones para los campos del Form 
function nodosMaximos(){
    amplitud= document.getElementById("amplitud").value;
    profundidad = document.getElementById("profundidad").value;
    //nodos totales maximos
    let nodosMax = ((profundidad-1)*amplitud)+1;
    document.getElementById("n_nodos").max = nodosMax;
    // nodos hijos 
    numNodos = document.getElementById("n_nodos").value;
    document.getElementById("nodos_h").value = numNodos-1;
    //nodos padres maximos 
    let padresMax=0;
    for (let i=1 ; i<=amplitud; i++){
        padresMax = padresMax + (profundidad-i);
    }
    document.getElementById("nodos_p").max = padresMax;
}

//Limpiar Campos del Form 
function LimpiarCampos(){
    document.getElementById("n_nodos").value = 0;
    document.getElementById("n_nodos").value = 0;
    document.getElementById("nodos_p").value = 0;
    document.getElementById("amplitud").value = 0;
    document.getElementById("profundidad").value = 0;

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
}

//Crear Nodos 
function crearNodos(){
    let x; 
    let y;
    let nRaiz
    //Nodo Raiz (nivel 0)
    if(nivel == 0){
        x = canvas.width/2;
        y = 50;
        nRaiz = new Nodo(ids[cont],null,x,y,nivel);
        cont ++;
        nivel ++;
        nodos.push(nRaiz);
    } 
    while (cont < numNodos) {
        while (nivel < (profundidad)) {
            x = distribucionX()*( nodosPorNivel() +1);
            y = distribucionY()*(nivel+1);
            let nodo;
            if(nivel == 1){
                nodo = new Nodo(ids[cont],nRaiz,x,y,nivel);
                nRaiz.hijos.push(nodo);
            }else{
                let index = asignarPadre();
                nodo = new Nodo(ids[cont],nodos[index],x,y,nivel);
                nodos[index].hijos.push(nodo);
            }
            cont ++;
            nivel ++;
            nodos.push(nodo);
        }
        if(nivel == profundidad ){
            nivel = 1;
        }
    }
}

function distribucionX(){
    let disX = canvas.width/amplitud;
    return disX;
}

function distribucionY(){
    let disY = canvas.height/profundidad;
    return disY;
}

function nodosPorNivel(){
    let nodoXNivel=0;
    for (let i = 0; i < nodos.length; i++) {
        if(nodos[i].nivel == nivel){
            nodoXNivel++;
        }  
    }
    if (nodoXNivel == amplitud) {
       nivel++; 
    }
    return nodoXNivel;
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
    } else{
        return 0;
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

function dibujarNodo(x,y){
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.stroke();
}