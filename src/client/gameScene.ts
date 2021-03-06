import * as Phaser from "phaser";

import PlayerController from "./playerController";
import { PlayerGameObject } from "./playerGameObject";
import { Room, DataChange } from "colyseus.js";
import { Assets } from "./assets";
import { ShellSprite } from "./shellSprite";
import { StateEntitiesManager } from "./stateEntitiesManager";
import { ExplosionSprite } from "./explosionSprite";
import { Constants } from "../imports/constants";

export default class GameScene extends Phaser.Scene {
  players: StateEntitiesManager<PlayerGameObject>;
  shells: StateEntitiesManager<ShellSprite>;
  explosions: StateEntitiesManager<ExplosionSprite>;

  room: Room;
  playerController: PlayerController;
  map: Phaser.Tilemaps.Tilemap;
  player: PlayerGameObject;

  constructor() {
    super("game");
  }

  preload() {
    Assets.assets.forEach((asset) => {
      this.load.image(asset.texture, asset.file);
    });
  }

  create() {
    this.children.removeAll();

    this.room = this.registry.get("room");

    this.createAnimations();

    this.createMap();

    this.createStateEntitiesManagers();

    this.setCameraBounds();

    this.assignPlayer();
  }

  update(time, delta) {
    if (this.playerController) {
      this.playerController.update(time, delta);
    }

    this.players.forEach((player) => {
      player.update(time, delta);
    });

    this.shells.forEach((shell) => {
      shell.update(time, delta);
    });

    this.explosions.forEach((explosion) => {
      explosion.update(time, delta);
    });
  }

  assignPlayer() {
    this.player = this.players.get(this.room.sessionId);
    const tank = this.player.tank;
    this.playerController = new PlayerController(this.registry.get("room"), this);
    this.cameras.main.startFollow(tank);
  }

  setCameraBounds() {
    this.cameras.main.setBounds(0, 0, this.map.width * this.map.tileWidth, this.map.height * this.map.tileHeight);
  }

  createMap() {
    const mapWidth = this.room.state.game.map.width;
    const mapHeight = this.room.state.game.map.height;
    const tileSize = Constants.TILE.TILE_SIZE;

    // Creating a blank tilemap with the specified dimensions
    this.map = this.make.tilemap(
      {
        tileWidth: tileSize,
        tileHeight: tileSize,
        width: mapWidth,
        height: mapHeight,
      },
    );

    const tiles = this.map.addTilesetImage("tiles");

    const layer = this.map.createBlankDynamicLayer("layer1", tiles);

    layer.setDepth(0);

    layer.randomize(0, 0, this.map.width, this.map.height, [0, 10]);

    this.map.convertLayerToStatic(layer);
  }

  private createAnimations() {
    this.anims.create({
      key: "explosion",
      frames: [
        { key: "explosion1", frame: 1 },
        { key: "explosion2", frame: 2 },
        { key: "explosion3", frame: 3 },
        { key: "explosion4", frame: 4 },
        { key: "explosion5", frame: 5 },
      ],
      repeat: 0,
      duration: Constants.EXPLOSION.LENGTH,
    });
  }

  private createStateEntitiesManagers() {
    this.players = new StateEntitiesManager<PlayerGameObject>(this.room, "game/players", (value) => {
      return new PlayerGameObject(this, value);
    });
    this.shells = new StateEntitiesManager<ShellSprite>(this.room, "game/shells", (value) => {
      return new ShellSprite(this, value);
    });
    this.explosions = new StateEntitiesManager<ExplosionSprite>(this.room, "game/explosions", (value) => {
      return new ExplosionSprite(this, value);
    });
  }
}
