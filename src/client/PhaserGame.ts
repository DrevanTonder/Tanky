import * as Phaser from "phaser";

import GameScene from "./gameScene";
import WaitingScene from "./waitingScene";
import { Room } from "colyseus.js";
import { Status } from "../imports/status";

export default class PhaserGame extends Phaser.Game {
  constructor(room: Room) {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      autofocus: true,
      scene: [WaitingScene, GameScene],
    };

    super(config);

    this.registry.set("room", room);

    room.listen("status", (change) => {
      if (change.value === Status.Playing) {
        this.scene.start("game");
        this.scene.stop("waiting");
      } else if (change.value === Status.WaitingForPlayers) {
        this.scene.stop("game");
        this.scene.start("waiting");
      }
    });

    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.resize(window.innerWidth, window.innerHeight);
  }
}