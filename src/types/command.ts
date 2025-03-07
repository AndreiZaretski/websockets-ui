export enum CommandGame {
  Reg = 'reg',
  UpdateWin = 'update_winners',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  CreateGame = 'create_game',
  UpdateRoom = 'update_room',
  AddShips = 'add_ships',
  StartGame = 'start_game',
  Attack = 'attack',
  RundomAttack = 'randomAttack',
  Turn = 'turn',
  Finish = 'finish',
  SinglePlay = 'single_play',
}

export enum StatusAttack {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
}
