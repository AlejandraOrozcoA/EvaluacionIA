//Form 

let numNodos = document.getElementById("n_nodos").value;
let numHijos = document.getElementById("n_nodos").value - 1;
let numPadres = document.getElementById("nodos_p").value;
let amplitud= document.getElementById("amplitud").value;
let profundidad = document.getElementById("profundidad").value;

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
        console.log(padresMax);
    }
    document.getElementById("nodos_p").max = padresMax;
}


function LimpiarCampos(){
    document.getElementById("n_nodos").value = 0;
    document.getElementById("n_nodos").value = 0;
    document.getElementById("nodos_p").value = 0;
    document.getElementById("amplitud").value = 0;
    document.getElementById("profundidad").value = 0;

}

//canvas 

let nodos = [];
let connectors = [];
let canvas = document.getElementById('main-canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth*(2/3); 
canvas.height = window.innerHeight;

let coor = new Array(2);
function llenarCoordenadas(){
    coor[0] = new Array(profundidad);
    coor[1] = new Array(amplitud);
    
}

function drawNodo(x,y){
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.text_color = "black";
    ctx.stroke();
}