import { AttackUser, IncomingData, IncomingRoom, IncomingUser, RandomAttack, UserShips } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { CommandGame } from '../types/command';
import WebSocketEx from '../types/websocketEx';
import { RoomsController } from '../room/rooms';
import { GameConntroller } from '../game/gameController';

export class WSController {
  message: IncomingData;
  data: IncomingUser | IncomingRoom | UserShips | AttackUser | RandomAttack;
  ws: WebSocketEx;
  roomsController: RoomsController;
  gameController: GameConntroller;

  constructor(ws: WebSocketEx, message: IncomingData) {
    this.message = message;
    this.data = this.message.data;
    this.ws = ws;
    this.roomsController = new RoomsController(this.ws);
    this.gameController = new GameConntroller(this.ws);
  }

  checkCommand() {
    switch (this.message.type) {
      case CommandGame.Reg:
        registerUsers(this.ws, this.data as IncomingUser);
        this.roomsController.updateCurrentRoom();
        this.roomsController.updateWinners();

        break;

      case CommandGame.CreateRoom:
        this.roomsController.updateRoom();
        break;

      case CommandGame.AddUserToRoom:
        this.roomsController.createGame(this.data as IncomingRoom);
        this.roomsController.updateCurrentRoom();
        break;

      case CommandGame.AddShips:
        this.gameController.startGame(this.data as UserShips);
        break;

      case CommandGame.Attack:
        this.gameController.attackControl(this.data as AttackUser);
        break;

      case CommandGame.RundomAttack:
        this.gameController.getRandomAttack(this.data as RandomAttack);
        break;

      case CommandGame.SinglePlay:
        this.roomsController.createGameWithBot();
        this.roomsController.updateCurrentRoom();
        break;

      default:
        console.error('Invalid message type');
        break;
    }
  }
}
