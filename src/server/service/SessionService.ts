import {BaseService} from './BaseService';
import {Repository} from '../db/Repository';
import {ISession} from '../helper/ISession';


export class SessionService extends BaseService<ISession> {

    constructor() {
        super(new Repository('session'));
    }
}