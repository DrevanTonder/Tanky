const Player = require('./player')
const GameObject = require('./gameObject')

module.exports = class Game extends GameObject {
  constructor(){
    super()
    this.players = []    
  }

  newPlayer(){
    let newPlayer = Player()
    this.players.push(newPlayer)
    return newPlayer
  }

  getData(){
    let players = []
    for (let i = 0; i < this.players.length; i++) {
      players.push(this.players[i].toJSON())
    }

    return {
      players: players
    }
  }
}
