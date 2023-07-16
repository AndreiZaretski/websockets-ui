import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { parseData } from '../helpers/parseData';
import { WSController } from './wsController';
import WebSocketEx from '../types/websocketEx';
import { wsClients } from '../data/userData';
import { GameConntroller } from '../game/gameController';
import { rooms } from '../data/gameData';
import { RoomsController } from '../room/rooms';

dotenv.config();

const WS_Port = Number(process.env.WSS_PORT) || 3000;

export const wss = new WebSocketServer({ port: WS_Port });

wss.on('connection', (ws: WebSocketEx) => {
  //console.log(`WebSocket server work on port ${WS_Port}`);
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log('received: %s', data);

    const result = parseData(data.toString());

    new WSController(ws, result).checkCommand();
  });

  ws.on('close', () => {
    if (ws.indexSocket !== undefined) {
      new GameConntroller(ws).isPlayerExit(ws.indexSocket);

      const searchIndexRoom = rooms.findIndex((user) => {
        return user.indexSocket === ws.indexSocket;
      });
      //console.log('this index', searchIndexRoom);
      if (searchIndexRoom !== -1) {
        rooms.splice(searchIndexRoom, 1);

        new RoomsController(ws).updateCurrentRoom();
      }
    }
    wsClients.delete(ws);
    console.log(`User with id ${ws.id} and ${ws.indexSocket} was closed`);
  });
});

wss.on('listening', () => {
  const adress = wss.address();
  console.log(`WebSocket server work on port ${WS_Port} and ${adress}`);
});
