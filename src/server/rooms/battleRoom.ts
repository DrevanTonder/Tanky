import { Game, IGameState } from "../game/game";
import { Room, nosync, Client } from "colyseus";
import { Global } from "../game/objects/global";
import { Status } from "../../imports/status";
import { Constants } from "../../imports/constants";

export class State {
    game: IGameState;
    status: Status = Status.WaitingForPlayers;

    @nosync
    Game: Game;
    players: string[] = [];

    update() {
        if (this.Game) {
            this.Game.update();

            this.game =  this.Game.toJSON();
        }
    }

    createPlayer(id: string) {
        this.players.push(id);

        if (this.Game) {
            this.Game.createPlayer(id);
        }

        if (this.status !== Status.Playing && this.players.length >= Constants.MIN_PLAYERS) {
            this.startGame();
        }
    }

    removePlayer(id: string) {
        const index = this.players.indexOf(id);
        this.players.splice(index, 1);

        if (this.Game) {
            this.Game.removePlayer(id);
        }
    }

    startGame() {
        this.Game = new Game(this.players);

        this.status = Status.Playing;
    }
}

export class BattleRoom extends Room<State> {
    maxClients = Constants.MAX_PLAYERS;

    public onInit(options) {
        console.log(this.roomName + " created!", options);

        Global.clock = this.clock;

        this.setState(new State());

        this.setSimulationInterval(() => this.update());
    }

    public onJoin(client: Client) {
        this.state.createPlayer(client.sessionId);
    }

    public onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    public onMessage(client: Client, data) {
        console.log(this.roomName + " received message from", client.sessionId, ":", data);
        this.state.Game.moveTank(client.sessionId, data);
    }

    public onDispose() {
        console.log("Dispose " + this.roomName);
    }

    update() {
        this.state.update();
    }
}