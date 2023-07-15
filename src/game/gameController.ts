import WebSocketEx from '../types/websocketEx';
import { GameService } from './gameService';
import { games } from '../data/gameData';
import { ShipsCoord, UserShips } from '../types/incomingData';
import { StartGameData } from '../types/responseData';
import { wsClients } from '../data/userData';
import { CommandGame } from '../types/command';

export class GameConntroller {
  ws: WebSocketEx;
  gameService: GameService;

  constructor(ws: WebSocketEx) {
    this.ws = ws;
    this.gameService = new GameService();
  }

  startGame(data: UserShips) {
    const currentGame = games.get(data.gameId);

    const userGameArray = this.gameService.addShips(data);
    const findUser = currentGame?.players.find((user) => user.idPlayer === data.indexPlayer);
    if (findUser && currentGame) {
      findUser.shipInfo = userGameArray;

      if (currentGame?.players[0].shipInfo.length !== 0 && currentGame?.players[1].shipInfo.length !== 0) {
        currentGame?.players.forEach((user) => {
          this.sendMessage(user.idPlayer, user.indexSocket, user.shipsCoord);
        });
        this.sendTurn(currentGame.players[0].indexSocket, currentGame.players[0].idPlayer);
      }
    }
  }

  private sendTurn(indexSocket: number, idPlayer: number) {
    const findClient = this.searchSocket(indexSocket);

    const res = {
      type: CommandGame.Turn,
      data: JSON.stringify({ currentPlayer: idPlayer }),
      id: 0,
    };

    findClient?.send(JSON.stringify(res));
  }

  private searchSocket(indexSocket: number) {
    const wsClientsArray = Array.from(wsClients);
    const findClient = wsClientsArray.find((ws) => ws.indexSocket === indexSocket);

    return findClient;
  }

  private sendMessage(idPlayer: number, indexSocket: number, ships: ShipsCoord[]) {
    // const wsClientsArray = Array.from(wsClients);
    // const findClient = idPlayer !== this.ws.id ? wsClientsArray.find((ws) => ws.indexSocket === indexSocket) : this.ws;

    const findClient = this.searchSocket(indexSocket);

    const sendData: StartGameData = {
      ships: ships,
      currentPlayerIndex: idPlayer,
    };

    const res = {
      type: CommandGame.StartGame,
      data: JSON.stringify(sendData),
      id: 0,
    };

    findClient?.send(JSON.stringify(res));
  }
}
