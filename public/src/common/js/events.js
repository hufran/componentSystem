/**
 * Created by Administrator on 2017/7/19.
 */
class events{
    constructor(type){
        this.type=type;
        this.data=null;
        this.target=null;
        this.msg=null;
        this.extraData=null;
    }
}
export {events};