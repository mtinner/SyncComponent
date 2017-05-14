import {CONSTANTS} from './helper/Constants';
export class Store {
    get(): string | null {
        let storeString = localStorage.getItem(CONSTANTS.HLS_SESSIONID);
        return storeString;
    }

    save(sessionId: string) {
        if (sessionId) {
            localStorage.setItem(CONSTANTS.HLS_SESSIONID, sessionId);
        }
    }
}