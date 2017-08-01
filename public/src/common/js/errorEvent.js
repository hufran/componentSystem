/**
 * Created by Administrator on 2017/7/19.
 */
import {events} from "./events"
class errorEvents extends events{
    constructor(type){
        super(type);
        this.code=null;
        this.errorMsg=null;
    }
}
export {errorEvents};