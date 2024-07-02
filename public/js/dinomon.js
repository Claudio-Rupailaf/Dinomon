const seccionBotonReinicio = document.getElementById("reiniciar")
const seccionSeleccionAtaque = document.getElementById("seleccion-ataque")
const botonDinoPlayer = document.getElementById("botonDino")

const botonReiniciar = document.getElementById("botonReiniciarJ")

const seccionSeleccionDino = document.getElementById("selecion-dino")
const spandinoplayer = document.getElementById("dinoPlayer")

const spandinorival = document.getElementById("dinoRival")

const spanvidaPlayer = document.getElementById("vidasPlayer")
const spanvidaEnemigo = document.getElementById("vidasEnemigo")

const seccionMensajes = document.getElementById("resultado")
const ataquesDelJugador = document.getElementById("ataqueDelJugador")
const ataquesDelEnemigo = document.getElementById("ataqueDelEnemigo")
const contenedorTargetas = document.getElementById("contenedorTargetas")
const contenedorAtaques = document.getElementById("contenedorAtaques")

const seccionVerMapa = document.getElementById("verMapa")
const mapa = document.getElementById("mapa")

let jugadorId = null
let enemigoId = null
let dinomones = []
let dinomonesEnemigos = []
let ataquePlayer = []
let ataqueEnemigo = []
let opcionDeDinomones
let inputigneoraptor 
let inputhidroboa 
let inputgeoscar 
let dinoJugador
let dinoJugadorObjeto
let ataquesDinomon
let ataquesDinomonEnemigo
let botonfuego 
let botonagua 
let botontierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidaTPlayer = 3
let vidaTEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackGround = new Image()
mapaBackGround.src ="./asset/mokemap.png"
let alturaQueQueremos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if(anchoDelMapa > anchoMaximoDelMapa){
  anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueQueremos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueQueremos

class Dinomon {
  constructor(nombre, foto, vida, fotoMapa, id = null) {
    this.id = id
    this.nombre = nombre
    this.foto = foto
    this.vida = vida
    this.ataques = []
    this.ancho = 50
    this.alto = 50
    this.x = aleatorio(0, mapa.width - this.ancho)
    this.y = aleatorio(0, mapa.height - this.alto)
    
    this.mapaFoto = new Image()
    this.mapaFoto.src = fotoMapa
    this.velocidadX = 0
    this.velocidadY = 0
  }
  pintarDinomon(){
    lienzo.drawImage(
      this.mapaFoto,
      this.x,
      this.y,
      this.ancho,
      this.alto
    )
  }


  
}

let igneoraptor = new Dinomon("igneoraptor", "./asset/igneoraptor.png", 5, "./asset/igneoraptorHead.png")

let hidroboa = new Dinomon("hidroboa", "./asset/hidroboa.png", 5, "./asset/hidroboaHead.png")

let geoscar = new Dinomon("geoscar", "./asset/geoscar.png", 5, "./asset/geoscarHead.png")



const hidroboaAtaques = [
  { nombre: "💧", id: "boton-agua"},
  { nombre: "💧", id: "boton-agua"},
  { nombre: "💧", id: "boton-agua"},
  { nombre: "🔥", id: "boton-fuego"},
  { nombre: "🌱", id: "boton-tierra"},
]
hidroboa.ataques.push(...hidroboaAtaques)


const igneoraptorAtaques = [
  { nombre: "🔥", id: "boton-fuego"},
  { nombre: "🔥", id: "boton-fuego"},
  { nombre: "🔥", id: "boton-fuego"},
  { nombre: "💧", id: "boton-agua"},
  { nombre: "🌱", id: "boton-tierra"},
]
igneoraptor.ataques.push(...igneoraptorAtaques)


const geoscarAtaques = [
  { nombre: "🌱", id: "boton-tierra"},
  { nombre: "🌱", id: "boton-tierra"},
  { nombre: "🌱", id: "boton-tierra"},
  { nombre: "💧", id: "boton-agua"},
  { nombre: "🔥", id: "boton-fuego"},
]
geoscar.ataques.push(...geoscarAtaques)


dinomones.push(hidroboa, igneoraptor, geoscar)


function iniciarJuego(){

    
    seccionBotonReinicio.style.display = "none"
    seccionSeleccionAtaque.style.display = "none"
    seccionVerMapa.style.display = "none"
    
    dinomones.forEach((dinomon) => {
        opcionDeDinomones = `
            <input type="radio" name="dino" id=${dinomon.nombre} /> 
            <label class="targetaDinomon" for=${dinomon.nombre}>
                <p>${dinomon.nombre}</p>
                <img src=${dinomon.foto} alt=${dinomon.nombre}>
            </label>`

            contenedorTargetas.innerHTML += opcionDeDinomones


             inputigneoraptor = document.getElementById("igneoraptor")
             inputhidroboa = document.getElementById("hidroboa")
             inputgeoscar = document.getElementById("geoscar")
    })
    
     
    botonDinoPlayer.addEventListener("click", seleccionarDinoPlayer)
    
   
    botonReiniciar.addEventListener("click", reiniciarJuego)

   unirseAlJuego()
 }
 
 function unirseAlJuego(){

  fetch("http://192.168.43.156:8080/unirse")
   .then((res) => {
    
    if (res.ok) {
      res.text()
      .then((respuesta) => {
        console.log(respuesta);
        jugadorId = respuesta
      })
    }
   })
 }

 function seleccionarDinoPlayer(){
    
  if(inputigneoraptor.checked){
    spandinoplayer.innerHTML = inputigneoraptor.id
    dinoJugador = inputigneoraptor.id
  } else if(inputhidroboa.checked){
    spandinoplayer.innerHTML = inputhidroboa.id
    dinoJugador = inputhidroboa.id
  } else if(inputgeoscar.checked){
    spandinoplayer.innerHTML = inputgeoscar.id
    dinoJugador = inputgeoscar.id
   } else{
     alert("seleciona un dino") 
     return
   }

    seccionSeleccionDino.style.display = "none"
    seleccionarDinomon(dinoJugador)

    extraerAtaques(dinoJugador)
    seccionVerMapa.style.display = "flex"
    iniciarMapa() 
 }

 function seleccionarDinomon(dinoJugador){
      fetch(`http://192.168.43.156:8080/dinomon/${jugadorId}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dinomon: dinoJugador
        })
      })
 }

 function extraerAtaques(dinoJugador){
    let ataques
    for (let i = 0; i < dinomones.length; i++) {
      if (dinoJugador === dinomones[i].nombre) {
        ataques = dinomones[i].ataques
      }
      
    }
      
      mostrarAtaques(ataques)
 }

  function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
      ataquesDinomon = `
      <button id=${ataque.id} class="botonAtaque BAtaque">${ataque.nombre}</button>
      `
      contenedorAtaques.innerHTML += ataquesDinomon
    })

      botonfuego = document.getElementById("boton-fuego")
      botonagua = document.getElementById("boton-agua")
      botontierra = document.getElementById("boton-tierra")
      botones = document.querySelectorAll(".BAtaque")

  }
  
  function secuenciaAtaque(){
    botones.forEach((boton) => {
      boton.addEventListener("click", (e) =>{
        if (e.target.textContent === "🔥") {
            ataquePlayer.push("Fuego")
            console.log(ataquePlayer)
            boton.style.background = "#F7F6BB"
            boton.disabled = true
          } else if (e.target.textContent === "💧"){
            ataquePlayer.push("Agua")
            console.log(ataquePlayer)
            boton.style.background = "#F7F6BB"
            boton.disabled = true
          } else if(e.target.textContent === "🌱") {
            ataquePlayer.push("Tierra")
            console.log(ataquePlayer)
            boton.style.background = "#F7F6BB"
            boton.disabled = true
          }
          if (ataquePlayer.length === 5) {
            enviarAtaques()
          }
          
      })
    })
    
  }

  function enviarAtaques() {
    fetch(`http://192.168.43.156:8080/dinomon/${jugadorId}/ataques`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ataques: ataquePlayer
      })
    })

    intervalo = setInterval(obtenerAtaques, 50)
  }
function obtenerAtaques() {
  fetch(`http://192.168.43.156:8080/dinomon/${enemigoId}/ataques`)
        .then(function (res) {
          if (res.ok) {
              res.json()
                .then(function ({ ataques }) {
                   if(ataques.length === 5) {
                    ataqueEnemigo = ataques
                        combate()
                   }
                })
          }
        })
}

 function seleccionarDinoRival(enemigo){
    spandinorival.innerHTML = enemigo.nombre
    ataquesDinomonEnemigo = enemigo.ataques
    secuenciaAtaque()
 }

 
 
 function ataqueAEnemigo(){
   let ataqueAleatorioR = aleatorio(0,ataquesDinomonEnemigo.length - 1)

   if(ataqueAleatorioR == 0 || ataqueAleatorioR ==1) {
     ataqueEnemigo.push("Fuego")
   } else if(ataqueAleatorioR == 3 || ataqueAleatorioR ==4) {
    ataqueEnemigo.push("Agua")
   } else {
    ataqueEnemigo.push("tierra")
   }
    console.log(ataqueEnemigo)
  iniciarPelea()

}
function iniciarPelea(){
  if (ataquePlayer.length === 5) {
    combate()
  }

}

function indexAmbosOponentes(jugador, enemigo){
    indexAtaqueJugador = ataquePlayer[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate(){

  clearInterval(intervalo)

  for (let index = 0; index < ataquePlayer.length; index++) {
     if(ataquePlayer[index] === ataqueEnemigo[index]) {
      indexAmbosOponentes(index, index)
      crearMensaje("empate")
      

    }else if (ataquePlayer[index] === "Fuego" && ataqueEnemigo[index] === "Tierra"){
      indexAmbosOponentes(index, index)
      crearMensaje("Ganaste")
      victoriasJugador++
      spanvidaPlayer.innerHTML = victoriasJugador
    }else if (ataquePlayer[index] === "Agua" && ataqueEnemigo[index] === "Fuego"){
      indexAmbosOponentes(index, index)
      crearMensaje("Ganaste")
      victoriasJugador++
      spanvidaPlayer.innerHTML = victoriasJugador
    }else if (ataquePlayer[index] === "Tierra" && ataqueEnemigo[index] === "Agua"){
      indexAmbosOponentes(index, index)
      crearMensaje("Ganaste")
      victoriasJugador++
      spanvidaPlayer.innerHTML = victoriasJugador
    }else {
      indexAmbosOponentes(index, index)
      crearMensaje("Perdiste")
      victoriasEnemigo++
      spanvidaEnemigo.innerHTML = victoriasEnemigo

    }
    
  }
    
        revisionVictorias()
}
      function revisionVictorias(){

        if(victoriasJugador === victoriasEnemigo){
            crearMensajeFinal("ESTO ES EMPATE 😤")
        } else if(victoriasJugador > victoriasEnemigo){
            crearMensajeFinal("GANASTE 🎉")
        }  else{
          crearMensajeFinal("PERDIMOS 😢")
        }
      }
  
function crearMensaje(mensajeFinal){
    let nuevoAtaqueDelJugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")

    seccionMensajes.innerHTML = mensajeFinal
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

   
    
    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
  }  
  function crearMensajeFinal(ResultadoFinal){
    
    
    seccionMensajes.innerHTML = ResultadoFinal


    
        seccionBotonReinicio.style.display = "block"
  } 
 function reiniciarJuego(){
    location.reload()
 }

 function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min )

 }
 function pintarCanvas(){

  dinoJugadorObjeto.x = dinoJugadorObjeto.x + dinoJugadorObjeto.velocidadX
  dinoJugadorObjeto.y = dinoJugadorObjeto.y + dinoJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
      mapaBackGround,
      0,
      0,
      mapa.width,
      mapa.height


    )
    dinoJugadorObjeto.pintarDinomon()
    enviarPosicion(dinoJugadorObjeto.x, dinoJugadorObjeto.y)

    dinomonesEnemigos.forEach(function (dinomon) {
      dinomon.pintarDinomon()
      revisarColision(dinomon)
    })
 }
 function enviarPosicion(x, y){
    fetch(`http://192.168.43.156:8080/dinomon/${jugadorId}/posicion`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        x,
        y
      })
    })
    .then(function(res){
      if (res.ok){
           res.json()
              .then(function ({ enemigos }) {
                console.log(enemigos)
               dinomonesEnemigos = enemigos.map(function(enemigo){
                  let dinomonEnemigo = null
                  const dinomonNombre = enemigo.dinomon.nombre || ""
                  if(dinomonNombre === "igneoraptor"){
                    dinomonEnemigo = new Dinomon("igneoraptor", "./asset/igneoraptor.png", 5, "./asset/igneoraptorHead.png", enemigo.id)
                  } else if (dinomonNombre === "hidroboa"){
                    dinomonEnemigo = new Dinomon("hidroboa", "./asset/hidroboa.png", 5, "./asset/hidroboaHead.png", enemigo.id)
                  } else if(dinomonNombre === "geoscar"){
                    dinomonEnemigo = new Dinomon("geoscar", "./asset/geoscar.png", 5, "./asset/geoscarHead.png", enemigo.id)
                  }
                    dinomonEnemigo.x = enemigo.x
                    dinomonEnemigo.y = enemigo.y

                    return dinomonEnemigo

                })
                
              })
      }
      
    })
 }

 function MoverDerecha(){
  dinoJugadorObjeto.velocidadX = 5
 }
 function MoverIzquierda(){
  dinoJugadorObjeto.velocidadX = -5
}
function MoverAbajo(){
  dinoJugadorObjeto.velocidadY = 5
}
function MoverArriba(){
  dinoJugadorObjeto.velocidadY = -5
}
function detenerMovimiento(){
 
  dinoJugadorObjeto.velocidadX = 0
  dinoJugadorObjeto.velocidadY = 0

}
function iniciarMovimiento(event){
  switch (event.key) {
    case "ArrowUp":
      MoverArriba()
      break
   case "ArrowDown":
      MoverAbajo()
      break
   case "ArrowLeft":
      MoverIzquierda()
      break
   case "ArrowRight":
      MoverDerecha()
    default:
      break
  }
}
function iniciarMapa(){
    
    dinoJugadorObjeto = obtenerObjetoDino(dinoJugador)
    intervalo = setInterval(pintarCanvas, 50)
      
     window.addEventListener("keydown", iniciarMovimiento)
     window.addEventListener("keyup", detenerMovimiento)   
}

function obtenerObjetoDino(){
  for (let i = 0; i < dinomones.length; i++) {
    if (dinoJugador === dinomones[i].nombre) {
      return dinomones[i]
    }
    
  }
}

function  revisarColision(enemigo){

  if(enemigo.x == undefined || enemigo.y == undefined){
    return}

  const arribaEnemigo = enemigo.y
  const abajoEnemigo = enemigo.y + enemigo.alto
  const derechaEnemigo = enemigo.x + enemigo.ancho
  const izquierdaEnemigo = enemigo.x

  const arribaDino = dinoJugadorObjeto.y
  const abajoDino = dinoJugadorObjeto.y + dinoJugadorObjeto.alto
  const derechaDino = dinoJugadorObjeto.x + dinoJugadorObjeto.ancho
  const izquierdaDino = dinoJugadorObjeto.x
  if(
    abajoDino < arribaEnemigo ||
    arribaDino > abajoEnemigo ||
    derechaDino < izquierdaEnemigo ||
    izquierdaDino > derechaEnemigo 
  ){
    return
  } detenerMovimiento()
   clearInterval(intervalo)

   

   enemigoId = enemigo.id
  seccionSeleccionAtaque.style.display = "flex" 
  seccionVerMapa.style.display = "none"
  seleccionarDinoRival(enemigo) 
  
}

 window.addEventListener("load", iniciarJuego)