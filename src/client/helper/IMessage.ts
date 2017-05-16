export interface IMessage {
    messageType: string
    session?: { sessionId: string, timestamp?: any }
}