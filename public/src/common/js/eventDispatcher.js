/**
 * Created by Administrator on 2017/7/19.
 *观察者模式
 */
var registerEvent={};
var uint=0;

class eventDispatcher{
    constructor(){
        this.eventList={}
    }
    addListener(type,fn){
        if(Object.prototype.toString.call(type)==="[object String]"&&Object.prototype.toString.call(fn)==="[object Function]"){
            uint++;
            if(this.eventList[type]){
                if(Object.prototype.toString.call(this.eventList[type])==="[object Array]"){
                    this.eventList[type].push(fn);
                    registerEvent[type].push(fn);
                }else{
                    this.eventList[type]=[fn];
                    registerEvent[type]=[fn];
                }

            }else{
                this.eventList[type]=[];
                this.eventList[type].push(fn);
                registerEvent[type]=[fn];
            }
        }else{
            throw "type and fn are optional, and type must be a string type, and fn must be a function";
        }

    }
    removeListener(type,fn){
        if(Object.prototype.toString.call(type)==="[object String]"){
            if(this.eventList.type){
                if(Object.prototype.toString.call(fn)==="[object Function]"){
                    //fn存在,将删除指定的监听器
                    let length=this.eventList.type.length;
                    for(let i=0;i<length;i++){
                        console.log(this.eventList.type[i]);
                        if(this.eventList.type[i]==fn){
                            this.eventList.type.splice(i,1);
                            registerEvent.type.splice(i,1);
                            return true;
                        }
                    }
                    return false;
                }else{
                    //fn 不存在,将移除所有监听器
                    Reflect.deleteProperty(this.eventList,type);
                    Reflect.deleteProperty(registerEvent,type);
                    return true;
                }
            }else{
                console.log("The removed listener does not exist");
                return false;
            }
            //Object.prototype.toString.call(fn)==="[object Function]"
        }else{
            throw "type are optional, and type must be a string type";
        }
    }
    dispatchEvent(event){
        if(Object.prototype.toString.call(event)==="[object Object]"){
            let type=event.type;
            if(this.eventList.type){
                let length=this.eventList.type.length;
                for(let i=0;i<length;i++){
                    event.target = this;
                    registerEvent.type[i].call(this,event);
                    //this.eventList.type.call();
                }
            }else{
                console.log("The listener "+type+" does not exist");
                return false;
            }
        }
        else{
            throw "event are optional, and event must be a Object type";
        }
    }
    hasListener(type){
        if(Object.prototype.toString.call(type)==="[object String]"){
            if(this.eventList.type){
                return this.eventList.type;
            }else{
                return false;
            }
        }else{
            throw "type are optional, and type must be a string type";
        }
    }

}
export {eventDispatcher}
