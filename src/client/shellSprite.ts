import { NetworkedSprite } from "./networkedSprite";

export class ShellSprite extends NetworkedSprite {
  constructor(scene, state) {
    super(scene, state, "shell");

    this.setScale(2);
    this.setDepth(1);
  }
}
