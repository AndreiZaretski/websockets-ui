import { IncomingUser } from '../types/incomingData';
import WebSocket from 'ws';
import { userDB } from './userDB';
import { CommandGame } from '../types/command';

export const registerUsers = (ws: WebSocket, data: IncomingUser) => {
  const { name, password } = data;

  const res = {
    type: CommandGame.Reg,
    data: '',
    id: 0,
  };
  const findUser = userDB.find((elem) => elem.name === name);

  if (!name || !password) {
    //return
    res.data = JSON.stringify({
      ...data,
      error: true,
      errorText: 'Error',
    });
  } else if (findUser && findUser.password !== password) {
    res.data = JSON.stringify({ name: name, index: findUser.index, error: true, errorText: 'Wrong password' });
  } else {
    const newUser = addUser(name, password);
    res.data = JSON.stringify({ name: name, index: newUser.index, error: false, errorText: '' });
  }
  ws.send(JSON.stringify(res));
  //console.log('Sent message to client: ', JSON.stringify(res));
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
