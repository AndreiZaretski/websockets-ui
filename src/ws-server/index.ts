import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { parseData } from '../helpers/parseData';
import { WSController } from './wsController';
import WebSocketEx from '../types/websocketEx';
import { wsClients } from '../data/userData';

dotenv.config();

const WS_Port = Number(process.env.WSS_PORT) || 3000;

export const wss = new WebSocketServer({ port: WS_Port });

wss.on('connection', (ws: WebSocketEx) => {
  //console.log(`WebSocket server work on port ${WS_Port}`);
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log('received: %s', data);

    //console.log('Parsing string: ' + data);

    const result = parseData(data.toString());

    new WSController(ws, result).checkCommand();
    //broadcast(result.toString());
  });

  ws.on('close', () => {
    wsClients.delete(ws);
    console.log(`User with id ${ws.id} and ${ws.indexSocket} was closed`);
  });
});

wss.on('listening', () => {
  console.log(`WebSocket server work on port ${WS_Port}`);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const broadcast = (result: any) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(result));
  });
};
