///<reference path="phaser.d.ts" />
import Phaser from 'phaser'

import GameScene from './gameScene'

export default class PhaserGame extends Phaser.Game {
  constructor(room) {
    var config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [GameScene],
      autofocus: true
    }

    super(config)
    
    this.registry.set('room', room)
    
    window.addEventListener('resize', () => this.onResize())
  }

  onResize(){
    this.resize(window.innerWidth, window.innerHeight)
  }
}


