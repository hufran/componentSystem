/**
 * Created by Administrator on 2017/7/19.
 * 组件抽象类，用于组件的抽象类型,抽象生命周期
 */
import {eventDispatcher} from "./eventDispatcher";
//修饰器
/*function throwException(target,name, descriptor) {

    target.exec=function(){
        throw new Error("Abstract classes need to be inherited before they can be accessed");
    };
    return target.exec();
}*/

class abstractComponent extends eventDispatcher{
    constructor(){
        super();
    }

    beforeCreate(){
        //在实例化之前调用该方法
        throw new Error("Abstract classes need to be inherited before they can be accessed");
    }
    created(){
        //实例化操作完成后调用该方法
        throw new Error("Abstract classes need to be inherited before they can be accessed");
    }
    beforeChange(){
        //修改前调用
        throw new Error("Abstract classes need to be inherited before they can be accessed");
    }
    changed(){
        //修改后变更对象调用
        throw new Error("Abstract classes need to be inherited before they can be accessed");
    }
    beforeDestory(){
        //销毁之前的操作
        throw new Error("Abstract classes need to be inherited before they can be accessed");
    }
    destoryed(){
        //销毁后操作
        throw new Error("Abstract classes need to be inherited before they can be accessed");
    }
}
export {abstractComponent}