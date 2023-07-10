import { CommandGame } from '../types/command';
import { RoomGame } from '../types/responseData';
import WebSocketEx from '../types/websocketEx';
import { userDB } from '../users/userDB';
import { wsClients } from '../users/users';

const rooms: RoomGame[] = [];

export class RoomsController {
  ws: WebSocketEx;

  constructor(ws: WebSocketEx) {
    this.ws = ws;
  }

  createRoom() {
    if (typeof this.ws.id === 'number') {
      const newRoom = {
        roomId: rooms.length,
        roomUsers: [
          {
            name: userDB[this.ws.id].name,
            index: this.ws.id,
          },
        ],
      };
      rooms.push(newRoom);
      return rooms;
    }
  }

  updateRoom() {
    const room = this.createRoom();

    if (room) {
      const res = {
        type: CommandGame.UpdateRoom,
        data: JSON.stringify(room),
        id: 0,
      };
      wsClients.forEach((client) => {
        client.send(JSON.stringify(res));
      });
    }
  }

  updateCurrentRoom() {
    const res = {
      type: CommandGame.UpdateRoom,
      data: JSON.stringify(rooms),
      id: 0,
    };
    wsClients.forEach((client) => {
      client.send(JSON.stringify(res));
    });
  }
}
