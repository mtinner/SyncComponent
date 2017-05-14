import WebSocket from 'ws';
import {CONSTANTS} from './helper/Constants';
import {IMessage} from './helper/IMessage';
import {generateUid} from './helper/UidGenerator';

export class Socket {
    private wss;
    private connectedWebSocket = new Array<ISessionWebSocket>();

    start() {
        this.wss = new WebSocket.Server({port: CONSTANTS.SERVER_PORT});
        this.wss.on('connection', (ws: MyWebSocket) => {
            console.log((new Date()) + ' Connection accepted.');

            ws.on('message', (message) => {
                let messageObj: IMessage = JSON.parse(message);
                console.log(messageObj);
                if (messageObj.messageType === CONSTANTS.MESSAGE_TYPE.NEW) {
                    let sessionId;
                    if (messageObj.data && messageObj.data.sessionId) {
                        sessionId = messageObj.data.sessionId;
                        ws.send(JSON.stringify({
                            ...messageObj,
                            ...{
                                data: {
                                    sessionId: messageObj.data.sessionId
                                }
                            }
                        }))
                    }
                    else {
                        sessionId = generateUid();
                        ws.send(JSON.stringify({...messageObj, ...{data: {sessionId: sessionId}}}));
                    }
                    this.connectedWebSocket.push({sessionId: sessionId, ws: ws});
                }
                else if (messageObj.messageType === CONSTANTS.MESSAGE_TYPE.CHANGE) {
                    this.multiCast(ws, messageObj);
                }
            });
            ws.on('close', () => {
                console.log((new Date()) + ' Peer ' + ws.remoteAddress + ' close ws.');
            });
        });
    }

    multiCast(ws, messageObj: IMessage) {
        this.connectedWebSocket.forEach((sessionWebsocket: ISessionWebSocket) => {
            if (sessionWebsocket.ws !== ws && sessionWebsocket.ws.readyState === WebSocket.OPEN && sessionWebsocket.sessionId === messageObj.data.sessionId) {
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