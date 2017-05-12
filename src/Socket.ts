import WebSocket from 'ws';
import {CONSTANTS} from './helper/Constants';
import {Store} from './Store';


export class Socket {
    private store = new Store();

    constructor() {
    }

    start() {
        const ws = new WebSocket(`ws://${CONSTANTS.SERVER_IP}:${CONSTANTS.SERVER_PORT}`);

        ws.on('open', () => {
            ws.send(this.store.get() || {});
        });

        ws.on('message', (data, flags) => {
            console.log('data', data, 'flags', flags);
        });
    }
}