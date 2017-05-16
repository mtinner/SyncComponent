import {SessionService} from '../service/SessionService';
import {ISession} from '../helper/ISession';
export class SessionManager {
    private sessionService = new SessionService();


    get(session: ISession) {
        return this.sessionService.get({sessionId: session.sessionId});
    }

    add(session: ISession) {
        return this.sessionService.add(session);
    }

    update(session: ISession) {
        return this.sessionService.update({sessionId: session.sessionId}, session);
    }
}