import {CONSTANTS} from './helper/Constants';
import {Store} from './Store';
import {IMessage} from './helper/IMessage';
import {EventBus} from './EventBus';
import {ISubscription} from './helper/ISubscription';


export class Socket {
    private store = new Store();
    private eventBus = EventBus.getInstance();
    private ws = new WebSocket(`ws://${CONSTANTS.SERVER_IP}:${CONSTANTS.SERVER_PORT}`);
    private subscription: ISubscription;


    start() {
        this.ws.onopen = () => {
            console.log({messageType: CONSTANTS.MESSAGE_TYPE.NEW, data: {sessionId: this.store.get()}});
            this.ws.send(JSON.stringify({
                messageType: CONSTANTS.MESSAGE_TYPE.NEW,
                data: {sessionId: this.store.get()}
            }));
        };

        this.ws.onmessage = (event: { data: string }) => {
            let message: IMessage = JSON.parse(event.data);
            console.log('data', message.data);
            if (message.messageType === CONSTANTS.MESSAGE_TYPE.NEW) {
                this.store.save(message.data.sessionId);
                this.eventBus.emit(CONSTANTS.SESSION_NOTIFIER_ID, message.data, {notifyOthersOnly: this.subscription});
            }
            else if (message.messageType === CONSTANTS.MESSAGE_TYPE.CHANGE) {
                this.eventBus.emit(CONSTANTS.SESSION_NOTIFIER_ID, message.data, {notifyOthersOnly: this.subscription});
            }
        };

        this.subscription = this.eventBus.subscribe(CONSTANTS.SESSION_NOTIFIER_ID, this.sessionChange);
    }

    sessionChange = (data) => {
        if (!data.sessionId) {
            throw new Error("Error: Does not contain sessionId");
        }
        else {
            let message: IMessage = {messageType: CONSTANTS.MESSAGE_TYPE.CHANGE, data: data};
            this.ws.send(JSON.stringify(message));
        }
    }
}