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
        console.log('User registerd');

        break;

      case CommandGame.CreateRoom:
        this.roomsController.updateRoom();
        console.log('Room added');
        break;

      case CommandGame.AddUserToRoom:
        this.roomsController.createGame(this.data as IncomingRoom);
        this.roomsController.updateCurrentRoom();
        console.log('Game created');
        break;

      case CommandGame.AddShips:
        this.gameController.startGame(this.data as UserShips);
        console.log('Shipps added');
        break;

      case CommandGame.Attack:
        this.gameController.attackControl(this.data as AttackUser);
        console.log('The attack happened');
        break;

      case CommandGame.RundomAttack:
        this.gameController.getRandomAttack(this.data as RandomAttack);
        console.log('Random attack happened');
        break;

      case CommandGame.SinglePlay:
        this.roomsController.createGameWithBot();
        this.roomsController.updateCurrentRoom();
        console.log('Single game was created');
        break;

      default:
        console.error('Invalid message type');
        break;
    }
  }
}
