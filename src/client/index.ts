import {CONSTANTS} from './helper/Constants';
import {Socket} from './Socket';
{
    window[CONSTANTS.HLS_SESSION] = {};
    let socket = new Socket();
    socket.start();
}
