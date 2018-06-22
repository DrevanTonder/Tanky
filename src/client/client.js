import io from 'socket.io-client'
var socket = io()

import Game from '../imports/game'

export default class Client{
  constructor(){
    this.game = new Game()

    this.player = null

    this.createSocketEventHandlers()
  }

  createSocketEventHandlers(){
    socket.on('assign-player', (data) => this.assignPlayer(data))
    socket.on('update:game', (data) => this.updateGame(data))
  }

  createGameEventHandlers(){
    this.game.players.forEach((player) => {
      player.tank.on('update', this.PhaserGame.update)
    })
  }

  assignPlayer(data){
    this.player = this.game.players.filter((player) => player.uid == data.uid)
  }

  updateGame(data){
    this.game.setData(data)
    console.log(this.game.data)
  }
}




