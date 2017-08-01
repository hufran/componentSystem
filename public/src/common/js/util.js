/**
 * Created by Administrator on 2017/7/19.
 * util工具类
 */
class util{
    constructor(){

    }
    bind(fn, selfObj){
        if (fn.bind) {
            return fn.bind(selfObj);
        } else {
            return function () {
                fn.apply(selfObj, arguments);
            }
        }
    }
    checkObjectIsEmpty(object){
        if(Reflect.toString.call(object)==="[object Object]"){
            for(var key in object){
                return false;
            }
            return true;
        }else{
            return true;
        }
    }
    analyzetpl(url,data){
        //格式化数据
        if(data){
            return url.replace(/\{(.*?)\}/ig,function(){
                if(typeof data[arguments[1]]=="undefined"){
                    return "";
                }
                return data[arguments[1]];
            })
        }
        return url;
    }
    /*
    * @description 加载style文件
    * @attr object 属性对象
    * @fn function 回调函数
    * */
    loadStyle(attr,fn){
        if(Object.prototype.toString.call(attr)==="[object Object]"){
            let styleElement=document.createElement("link");
            for(let key in attr){
                styleElement[key]=attr[key];
            }
            if (styleElement.readyState) {
                styleElement.onreadystatechange = function () {
                    if (styleElement.readyState == "loaded" || styleElement.readyState == "complete") {
                        styleElement.onreadystatechange = null;
                        if(Object.prototype.toString.call(fn)==="[object Function]"){
                            fn();
                        }
                    }
                }
            } else {
                styleElement.onload = function () {
                    if(Object.prototype.toString.call(fn)==="[object Function]"){
                        fn();
                    }
                };
            }
            document.body.appendChild(styleElement);
        }else{
            return false;
        }
    }
    /*
     * @description 加载script文件
     * @attr object 属性对象
     * @fn function 回调函数
     * */
    loadScript(attr,fn){
        if(Object.prototype.toString.call(attr)==="[object Object]"){
            let scriptElement=document.createElement("script");
            for(let key in attr){
                scriptElement[key]=attr[key];
            }
            if (scriptElement.readyState) {
                scriptElement.onreadystatechange = function () {
                    if (scriptElement.readyState == "loaded" || scriptElement.readyState == "complete") {
                        scriptElement.onreadystatechange = null;
                        if(Object.prototype.toString.call(fn)==="[object Function]"){
                            fn();
                        }
                    }
                }
            } else {
                scriptElement.onload = function () {
                    if(Object.prototype.toString.call(fn)==="[object Function]"){
                        fn();
                    }
                };
            }
            document.body.appendChild(scriptElement);
        }else{
            return false;
        }
    }
}
export {util}