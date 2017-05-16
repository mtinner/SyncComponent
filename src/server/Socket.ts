import WebSocket from 'ws';
import { CONSTANTS } from './helper/Constants';
import { IMessage } from './helper/IMessage';
import { generateUid } from './helper/UidGenerator';
import { SessionManager } from './manager/SessionManager';
import { ISession } from './helper/ISession';

export class Socket {
    private wss;
    private connectedWebSocket = new Array<ISessionWebSocket>();
    private sessionManager = new SessionManager();

    start() {
        this.wss = new WebSocket.Server({ port: CONSTANTS.SERVER_PORT });
        this.wss.on('connection', (ws: MyWebSocket) => {
            console.log((new Date()) + ' Connection accepted.');

            ws.on('message', (message) => {
                let incomingMessage: IMessage = JSON.parse(message);
                console.log(incomingMessage);
                if (incomingMessage.messageType === CONSTANTS.MESSAGE_TYPE.NEW) {
                    let sessionId;
                    if (incomingMessage.session && incomingMessage.session.sessionId) {

                        this.sessionManager.get(incomingMessage.session)
                            .then(session => {
                                if (session && session.sessionId) {
                                    this.connectedWebSocket.push({ sessionId: session.sessionId, ws: ws });
                                    this.sendMessage(ws, incomingMessage, session);
                                }
                                else {
                                    sessionId = generateUid();
                                    this.connectedWebSocket.push({ sessionId: sessionId, ws: ws });
                                    this.sessionManager.add({ sessionId: generateUid() })
                                        .then((session: ISession) => this.sendMessage(ws, incomingMessage, session));
                                }
                            });
                    }
                    else {
                        sessionId = generateUid();
                        this.connectedWebSocket.push({ sessionId: sessionId, ws: ws });
                        this.sessionManager.add({ sessionId: sessionId })
                            .then((session: ISession) => this.sendMessage(ws, incomingMessage, session));
                    }
                }
                else if (incomingMessage.messageType === CONSTANTS.MESSAGE_TYPE.CHANGE) {
                    this.sessionManager.update(incomingMessage.session)
                        .then(_ => this.multiCast(ws, incomingMessage));
                }
            });
            ws.on('close', () => {
                console.log((new Date()) + ' Peer ' + ws.remoteAddress + ' close ws.');
            });
        });
    }

    sendMessage(ws, incomingMessage, session) {
        console.log('send', {
            ...incomingMessage,
            ...{
                session: session
            }
        })
        ws.send(JSON.stringify({
            ...incomingMessage,
            ...{
                session: session
            }
        }))
    }

    multiCast(ws, messageObj: IMessage) {
        this.connectedWebSocket.forEach((sessionWebsocket: ISessionWebSocket) => {
            if (sessionWebsocket.ws !== ws && sessionWebsocket.ws.readyState === WebSocket.OPEN && sessionWebsocket.sessionId === messageObj.session.sessionId) {
                sessionWebsocket.ws.send(JSON.stringify(messageObj));
            }
        });
    }
}

declare class MyWebSocket extends WebSocket {
    _socket: MySocket;

    remoteAddress(): string;

    on(name: string, cb?)
}

declare class MySocket {
    setKeepAlive(bool: boolean): void;
}

interface ISessionWebSocket {
    sessionId: string,
    ws: MyWebSocket
}