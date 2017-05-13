import WebSocket from 'ws';
import {CONSTANTS} from './helper/Constants';
import {IMessage} from './helper/IMessage';
import {generateUid} from './helper/UidGenerator';

export class Socket {

    start() {
        const wss = new WebSocket.Server({port: CONSTANTS.SERVER_PORT});
        wss.on('connection', (ws: MyWebSocket) => {
            console.log((new Date()) + ' Connection accepted.');

            ws.on('message', (message) => {
                console.log('Received Message: ' + message);
                let messageObj: IMessage = JSON.parse(message);
                console.log('obj:', messageObj);
                if (messageObj.messageType === CONSTANTS.MESSAGE_TYPE.NEW) {
                    if (messageObj.data && messageObj.data.sessionId) {
                        console.log('if');
                        ws.send(JSON.stringify({
                            ...messageObj,
                            ...{
                                data: {
                                    sessionId: messageObj.data.sessionId,
                                    timestamp: new Date()
                                }
                            }
                        }))
                    }
                    else {
                        console.log('else');
                        ws.send(JSON.stringify({...messageObj, ...{data: {sessionId: generateUid()}}}));
                    }
                }
                else if (messageObj.messageType === CONSTANTS.MESSAGE_TYPE.CHANGE) {
                    messageObj.data.timestamp = new Date();
                    ws.send(JSON.stringify(messageObj));
                }
            });

            ws.on('close', () => {
                console.log((new Date()) + ' Peer ' + ws.remoteAddress + ' close ws.');
            });
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