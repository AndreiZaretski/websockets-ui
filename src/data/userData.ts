import { User } from '../types/types';
import WebSocketEx from '../types/websocketEx';

export const userDB: User[] = [];

export const wsClients = new Set<WebSocketEx>();
