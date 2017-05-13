import {CONSTANTS} from './helper/Constants';
import {Store} from './Store';
import {IMessage} from './helper/IMessage';


export class Socket {
    private store = new Store();

    constructor() {
    }

    start() {

        const ws = new WebSocket(`ws://${CONSTANTS.SERVER_IP}:${CONSTANTS.SERVER_PORT}`);

        ws.onopen = () => {
            console.log({messageType: CONSTANTS.MESSAGE_TYPE.NEW, data: {sessionId: this.store.get()}});
            ws.send(JSON.stringify({messageType: CONSTANTS.MESSAGE_TYPE.NEW, data: {sessionId: this.store.get()}}));
        };

        ws.onmessage = (event: { data: string }) => {
            let message: IMessage = JSON.parse(event.data);
            console.log('data', message.data);
            this.store.save(message.data.sessionId);
        };
    }
}