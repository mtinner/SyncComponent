import {ISession} from './ISession';
export interface IMessage {
    messageType: string
    session?: ISession
}