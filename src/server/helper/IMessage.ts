export interface IMessage {
    messageType: string
    data?: { sessionId: string, timestamp?: any }
}