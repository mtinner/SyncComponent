import {CONSTANTS} from './helper/Constants';
import {generateUid} from './helper/UidGenerator';
import {ISubscription} from './helper/ISubscription';
import {IEmitOptions} from './helper/IEmitOptions';
export class EventBus {
    private subscribers = new Array<Topic>();
    private static _instance: EventBus = new EventBus();

    constructor() {
        if (EventBus._instance) {
            throw new Error("Error: Instantiation failed: Use EventBus.getInstance() instead of new.");
        }
        window[CONSTANTS.HLS_SESSION] = {};
        window[CONSTANTS.HLS_SESSION].subscribe = this.subscribe;
        window[CONSTANTS.HLS_SESSION].emit = this.emit;
        EventBus._instance = this;
    }

    public static getInstance(): EventBus {
        return EventBus._instance;
    }

    subscribe = (name: string, callback: Function): ISubscription => {
        if (!this.subscribers.some(topic => topic.name === name)) {
            this.subscribers.push({name: name, subscribers: new Array<Subscriber>()});
        }
        let sid = generateUid();
        let topic = this.subscribers.find(topic => topic.name === name);
        topic.subscribers.push({uid: sid, cb: callback});
        if (topic.data) {
            callback(topic.data);
        }
        return {unsubscribe: this.unsubscriber(name, sid), uid: sid};
    };

    emit = (name: string, data: any, options?: IEmitOptions) => {
        if (this.subscribers.some(topic => topic.name === name)) {
            let topic = this.subscribers.find(topic => topic.name === name);
            topic.data = data;
            topic.subscribers.forEach(subscriber => {
                if (!(options && options.notifyOthersOnly && options.notifyOthersOnly.uid === subscriber.uid))
                    subscriber.cb(data)
            });
        }
    };


    unsubscriber = (name: string, uid: string) => {
        let topicName = name,
            subscriptionUid = uid;
        return () => {
            if (this.subscribers.some(topic => topic.name === topicName)) {
                let topic = this.subscribers.find(topic => topic.name === topicName);
                topic.subscribers = topic.subscribers.filter(subscriber => subscriber.uid !== subscriptionUid);
            }
        }
    };
}

interface Subscriber {
    uid: string,
    cb: Function
}

interface Topic {
    name: string,
    subscribers: Array<Subscriber>
    data?: any
}