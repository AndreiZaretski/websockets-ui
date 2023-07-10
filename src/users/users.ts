import { IncomingUser } from '../types/incomingData';
import { userDB } from './userDB';
import { CommandGame } from '../types/command';
import WebSocketEx from '../types/websocketEx';

export const wsClients = new Set<WebSocketEx>();

export const registerUsers = (ws: WebSocketEx, data: IncomingUser) => {
  const { name, password } = data;

  const res = {
    type: CommandGame.Reg,
    data: '',
    id: 0,
  };
  const findUser = userDB.find((elem) => elem.name === name);

  if (!name || !password) {
    res.data = JSON.stringify({
      ...data,
      error: true,
      errorText: 'Error',
    });
  } else if (findUser && findUser.password !== password) {
    res.data = JSON.stringify({ name: name, index: findUser.index, error: true, errorText: 'Wrong password' });
  } else if (findUser && findUser.password === password) {
    res.data = JSON.stringify({ name: name, index: findUser.index, error: false, errorText: '' });
    ws.id = findUser.index;
    wsClients.add(ws);
  } else {
    const newUser = addUser(name, password);
    wsClients.add(ws);
    res.data = JSON.stringify({ name: name, index: newUser.index, error: false, errorText: '' });

    ws.id = newUser.index;
  }
  ws.send(JSON.stringify(res));
};

const addUser = (name: string, password: string, users = userDB) => {
  const newUser = {
    name: name,
    password: password,
    index: users.length,
  };

  users.push(newUser);

  return newUser;
};
