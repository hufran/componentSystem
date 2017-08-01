/**
 * Created by Administrator on 2017/7/25.
 * 继承抽象类实例
 */
import {query} from "./query"
import {util} from "./util"
import {abstractComponent} from "./abstractComponent"
import {events} from "./events";
let utils=new util();
class abstractExample extends abstractComponent{
    constructor(){
        super();
        this.element=null;
        this.params=null;
    }
    beforeCreate(data){
        let datas=new events("beforeCreate");
        datas.data=data;
        this.dispatchEvent(datas);
        this.init();
    }
    created(data){
        let datas=new events("created");
        datas.data=data;
        this.dispatchEvent(datas);
    }
    beforeChange(data){
        let datas=new events("beforeChange");
        datas.data=data;
        this.dispatchEvent(datas);
    }
    changed(data){
        let datas=new events("changed");
        datas.data=data;
        this.dispatchEvent(datas);
    }
    beforeDestory(data){
        let datas=new events("beforeDestory");
        datas.data=data;
        this.dispatchEvent(datas);
    }
    destoryed(data){
        let datas=new events("destoryed");
        datas.data=data;
        this.dispatchEvent(datas);
    }
    init(selector,tmpl,extendElement){
        let self=this;
        this.element=query(selector);
        this.element.html(tmpl);
        if(extendElement){
            utils.bind(extendElement,this)(this.element);
        }
        //创建事件监听
        this.enterDocument();
        this.created();
    }
    enterDocument(){
        //添加事件监听函数

    }
    destoryDocument(extendElement){
        let self=this;
        this.beforeDestory();
        if(extendElement){
            extendElement();
        }
        for(let key in this.eventList){
            if(this.eventList[key]){
                util.bind(this.removeListener,this)(this.eventList[key]);
            }
        }
        this.element.html("");
        this.element=null;
        this.eventDispatcher=null;
        this.removeListener=null;
        this.dispatchEvent=null;
        this.hasListener=null;
        this.eventList=null;
        registerEvent=null;
        this.destoryed();
    }

}
export {abstractExample}