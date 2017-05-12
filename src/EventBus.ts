import {CONSTANTS} from './common/Constants';
import {generateUid} from './common/UidGenerator';
export class EventBus {
    private subscribers = new Array<Topic>();
    private static _instance: EventBus = new EventBus();

    constructor() {
        if (EventBus._instance) {
            throw new Error("Error: Instantiation failed: Use EventBus.getInstance() instead of new.");
        }
        window[CONSTANTS.HLS_SESSION].subscribe = this.subscribe;
        window[CONSTANTS.HLS_SESSION].change = this.change;
        EventBus._instance = this;
    }

    public static getInstance(): EventBus {
        return EventBus._instance;
    }

    subscribe(name: string, callback: (data: any) => {}) {
        if (!this.subscribers.some(topic => topic.name === name)) {
            this.subscribers.push({name: name, subscribers: new Array<Subscriber>()});
        }
        let uid = generateUid();
        let topic = this.subscribers.find(topic => topic.name === name);
        topic.subscribers.push({uid: uid, cb: callback});
        return {unsubscribe: this.unsubscriber(name, uid)}
    }

    emit(name: string, data: any) {
        if (this.subscribers.some(topic => topic.name === name)) {
            let topic = this.subscribers.find(topic => topic.name === name);
            topic.subscribers.forEach(subscriber => subscriber.cb(data));
        }
    }


    unsubscriber(name: string, uid: string) {
        let topicName = name,
            subscriptionUid = uid;
        return function () {
            if (this.subscribers.some(topic => topic.name === topicName)) {
                let topic = this.subscribers.find(topic => topic.name === topicName);
                topic = topic.subscribers.filter(subscriber => subscriber.uid !== subscriptionUid);
            }
        }
    }

    change(name, data) {
        //TODO send to client on response
        this.emit(name, data);
    }
}

interface Subscriber {
    uid: string,
    cb: (data: any) => {}
}

interface Topic {
    name: string,
    subscribers: Array<Subscriber>
}