import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';

type WebSocketMethod = {
  connectionHandler: (ws: WebSocket, request: IncomingMessage) => void;
};

export default WebSocketMethod;

