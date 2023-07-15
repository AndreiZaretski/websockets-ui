import { IncomingData, IncomingRoom, IncomingUser, UserShips } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { CommandGame } from '../types/command';
import WebSocketEx from '../types/websocketEx';
import { RoomsController } from '../room/rooms';
import { GameConntroller } from '../game/gameController';
//import { userDB } from '../data/userData';
//import { rooms } from '../room/rooms';

export class WSController {
  message: IncomingData;
  data: IncomingUser | IncomingRoom | UserShips;
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
        //if (this.data instanceof IncomingUser) {}
        registerUsers(this.ws, this.data as IncomingUser);
        this.roomsController.updateCurrentRoom();

        break;

      case CommandGame.CreateRoom:
        //console.log('Room %s', this.data, this.ws.id);
        this.roomsController.updateRoom();
        break;

      case CommandGame.AddUserToRoom:
        //console.log('add user', this.ws.id, this.data, userDB);
        this.roomsController.createGame(this.data as IncomingRoom);
        this.roomsController.updateCurrentRoom();
        break;

      case CommandGame.AddShips:
        this.gameController.startGame(this.data as UserShips);
        console.log('game');
    }
  }
}
