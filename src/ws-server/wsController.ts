import { IncomingData, IncomingUser } from '../types/incomingData';
import { registerUsers } from '../users/users';
import { CommandGame } from '../types/command';
import WebSocketEx from '../types/websocketEx';
import { RoomsController } from '../room/rooms';

export class WSController {
  message!: IncomingData;
  data: IncomingUser;
  ws: WebSocketEx;

  constructor(ws: WebSocketEx, message: IncomingData) {
    this.message = message;
    this.data = this.message.data as IncomingUser;
    this.ws = ws;
  }

  checkCommand() {
    switch (this.message.type) {
      case CommandGame.Reg:
        registerUsers(this.ws, this.data);
        new RoomsController(this.ws).updateCurrentRoom();
        break;

      case CommandGame.CreateRoom:
        console.log('Room %s', this.data, this.ws.id);
        new RoomsController(this.ws).updateRoom();
        break;
    }
  }
}
