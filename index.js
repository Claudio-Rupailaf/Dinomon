const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.static(`public`))
app.use(cors())
app.use(express.json())
const jugadores = []

class Jugador {
    constructor(id){
        this.id = id
    }
    asignardinomon(dinomon){
        this.dinomon = dinomon
    }

    actualizarposicion(x, y){
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques){
        this.ataques = ataques
    }
}
class Dinomon {
    constructor(nombre){
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
const id = `${Math.random()}`

const jugador = new Jugador(id)

jugadores.push(jugador)

res.setHeader("Access-Control-Allow-Origin", "*")

    res.send(id)
})

app.post("/dinomon/:jugadorId", (req, res)  => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.dinomon || ""
    const dinomon = new Dinomon(nombre)

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignardinomon(dinomon)
    }


    console.log(jugadores)
    console.log(jugadorId)
    res.end()
})

app.post("/dinomon/:jugadorId/posicion", (req, res) => {
     const jugadorId = req.params.jugadorId || ""
     const x = req.body.x || 0
     const y = req.body.y || 0

     const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarposicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id )

    res.send({
        enemigos
    })
})

app.post("/dinomon/:jugadorId/ataques", (req, res)  => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []
    

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }


    
    res.end()
})

app.get("/dinomon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

app.listen(8080, () => {
    console.log("servior en funcionamiento")
})