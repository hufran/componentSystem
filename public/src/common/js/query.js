/**
 * Created by Administrator on 2017/7/19.
 * 获取用户元素公用方法
 */
import {eventDispatcher} from "../../common/js/eventDispatcher";
import {animate} from "../../common/js/animate";
import {util} from "../../common/js/util";
var utils=new util();

class querySelector extends eventDispatcher{
    //selector 选择器 context：在指定的context中查找selector
    constructor(selector,context){
        super();
        let element=null;
        this.ele=null;
        this.length=0;
        /*不允许使用dispatchEvent方法*/
        this.dispatchEvent=null;
        if(typeof context!=="undefined"){
            element=this.queryElement(context);
            this.ele=this.queryElement(selector,element);
        }else if(typeof selector!=="undefined"){
            this.ele=this.queryElement(selector);
        }
        return this.returnValue();
    }
    returnValue(element){
        let self=this;
        let returnArr=new Array();

        if(typeof element!=="undefined"){
            returnArr=[element];
            this.length=element.length?element.length:1;
        }else{
            returnArr=[self.ele];
            this.length=self.ele.length?self.ele.length:1;
        }
        if(Object.prototype.toString.call(this)==="[object Array]"){
            returnArr.__proto__=this.__proto__;
            returnArr.__proto__.ele=this.ele;
            returnArr.__proto__.length=this.length;
        }else{
            returnArr.__proto__=this;
        }


        return returnArr;
    }
    //外观模式处理元素
    queryElement(selector,ele){
        //判断传递参数是否为string或者为html元素
        let isHtmlCollection=Object.prototype.toString.call(selector)==="[object HTMLCollection]";
        let isHtml=Object.prototype.toString.call(selector).indexOf("[object HTML");
        if(Object.prototype.toString.call(selector)==="[object String]"||isHtmlCollection||isHtml!=-1){
            if(isHtml!=-1||isHtmlCollection){
                return selector;
            }else{
                selector=selector.trim();
                let selectorList=selector.split(" ");
                let length=selectorList.length;
                let selectorString="";
                for(let i=0;i<length;i++){
                    if(selectorList[i].indexOf(">")!==-1){
                        let splitList=selectorList[i].split(">");
                        selectorList.splice(i,0,splitList[0]).splice(i,0,splitList[1]);
                    }else if(selectorList[i].indexOf(":")!==-1){
                        let splitList=selectorList[i].split(":");
                        selectorList[i]=splitList[0]+"[type="+splitList[1]+"]";
                    }
                }
                if(!!document.querySelectorAll){
                    //支持querySelectorAll方法
                    selectorList.forEach((str,i)=>{
                        selectorString+=str+" ";
                    });
                    if(ele){
                        return ele.querySelectorAll(selectorString.trim());
                    }else{
                        return document.querySelectorAll(selectorString.trim());
                    }
                }else{
                    //不支持该方法的解决方案
                    let element=ele?ele:null;
                    let length=selectorList.length;
                    for(let i=0;i<length;i++){
                        if(selectorList[i].startsWith("#")){
                            selectorList[i]=selectorList[i].substring(1);
                            try{
                                if(Object.prototype.toString.call(element)==="[object HTMLCollection]"){
                                    let length=element.length,eleList=null,j=0;
                                    for(j;j<length;j++){
                                        if(element[j].getElementById(selectorList[i])){
                                            eleList=element[j].getElementById(selectorList[i]);
                                            break;
                                        }
                                    }
                                    element=!eleList?element:eleList;
                                }else if(Object.prototype.toString.call(element).indexOf("[object HTML")!=-1){
                                    element=element.getElementById(selectorList[i]);
                                }else{
                                    element=document.getElementById(selectorList[i]);
                                }
                            }catch(e){
                                element=document;
                            }
                        }else if(selectorList[i].startsWith(".")){
                            selectorList[i]=selectorList[i].substring(1);
                            try{
                                if(Object.prototype.toString.call(element)==="[object HTMLCollection]"){
                                    let length=element.length,eleList=null,j=0;
                                    for(j;j<length;j++){
                                        if(element[j].getElementsByClassName(selectorList[i])){
                                            eleList=element[j].getElementsByClassName(selectorList[i]);
                                            break;
                                        }
                                    }
                                    element=!eleList?element:eleList;

                                }else if(Object.prototype.toString.call(element).indexOf("[object HTML")!=-1){
                                    element=element.getElementsByClassName(selectorList[i])
                                }else{
                                    element=document.getElementsByClassName(selectorList[i]);
                                }
                            }catch(e){
                                element=document;
                            }
                        }else{
                            try{
                                if(Object.prototype.toString.call(element)==="[object HTMLCollection]"){
                                    let length=element.length,eleList=null;
                                    let j=0;
                                    for(j;j<length;j++){
                                        if(element[j].getElementsByTagName(selectorList[i])){
                                            eleList=element[j].getElementsByTagName(selectorList[i]);
                                            break;
                                        }
                                    }
                                    element=!eleList?element:eleList;
                                }else if(Object.prototype.toString.call(element).indexOf("[object HTML")!=-1){
                                    element=element.getElementsByTagName(selectorList[i]);

                                }else{
                                    element=document.getElementsByTagName(selectorList[i]);
                                }
                            }catch(e){
                                element=document;
                            }
                        }
                    }
                    return element;
                }
            }
        }else{
            throw "selector is required or is not of the correct type";
        }
    }
    /*查找元素*/
    find(selector){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(selector)==="[object String]"){
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                this.ele=this.queryElement(selector,ele);
                return this.returnValue();
            }else{
                throw "selector is required or is not of the correct type";
            }

        }
    }
    eq(index){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            this.ele=this[0];
            index=parseInt(index);
            let length=this.ele.length;
            if(isNaN(index)||index<0||index>=length){
                //无效的index;
                throw "Invalid argument";
            }else{
                this.ele=this.ele[index]||this.ele;
                return this.returnValue();
            }
        }
    }
    //css属性操作,name既可以是字符串，也可以是对象,value可选，传递后将会设置样式值
    css(name,value){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            //获取元素的style样式
            this.ele=this[0];
            let length=this.ele.length;
            if(Object.prototype.toString.call(name)==="[object String]"){
                //判断value是否存在，存在状态下将会设置属性
                if(Object.prototype.toString.call(value)==="[object String]"){
                    if(length){
                        let styleAttribute=this.ele[0].style;

                        if(styleAttribute){
                            styleAttribute[name]=value;
                        }else{
                            this.ele[0].setAttribute("style",name+":"+value+";");
                        }

                    }else{
                        let styleAttribute=this.ele.style;
                        if(styleAttribute){
                            styleAttribute[name]=value;
                        }else{
                            this.ele.setAttribute("style",name+":"+value+";");
                        }
                    }

                }else{
                    if(length){
                        if(window.getComputedStyle){
                            return window.getComputedStyle(this.ele[0])[name];
                        }else{
                            return this.ele[0].currentStyle[name]
                        }
                    }else{
                        if(window.getComputedStyle){
                            return window.getComputedStyle(this.ele)[name];
                        }else{
                            return this.ele.currentStyle[name];
                        }
                    }
                }
                return this.returnValue();
            }else if(Object.prototype.toString.call(name)==="[object Object]"){
                if(length){
                    let styleAttribute=this.ele[0].style;
                    if(styleAttribute){
                        for(let key in name){
                            styleAttribute[key]=name[key];
                        }
                    }else{
                        this.ele[0].setAttribute("style","");
                        for(let key in name){
                            styleAttribute[key]=name[key];
                        }
                    }
                }else{
                    let styleAttribute=this.ele.style;
                    if(styleAttribute){
                        for(let key in name){
                            styleAttribute[key]=name[key];
                        }
                    }else{
                        this.ele.setAttribute("style","");
                        for(let key in name){
                            styleAttribute[key]=name[key];
                        }
                    }
                }
                return this.returnValue();
            }else{
                throw "name is required or is not of the correct type";
            }
        }
    }
    //html操作
    html(tmpl){
        if(this.ele== null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(tmpl)==="[object String]"){
                this.ele=this[0];
                this.ele=this.ele[0]?this.ele[0]:this.ele;
                this.ele.innerHTML=tmpl;
                return this.returnValue();
            }else{
                throw "tmpl is required or is not of the correct type";
            }
        }
    }
    //检查是否包含指定的class类
    hasClass(className){
        if(this.ele== null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(className)==="[object String]"){
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                let classList=ele.getAttribute("class").trim().split(" ");
                let userClassList=className.trim().split(" ");
                let length=classList.length,userLength=userClassList.length;
                var resultList=[];
                for(let i=0;i<length;i++){
                    for(let j=0;j<userLength;j++){
                        if(classList[i]===userLength[j]){
                            resultList.push(userLength[j]);
                        }
                    }
                }
                if(userLength==resultList.length){
                    return true;
                }else{
                    return false;
                }
            }else{
                throw "className is required or is not of the correct type";
            }
        }
    }
    //添加class类
    addClass(className){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(className)==="[object String]"){
                this.ele=this[0];
                let length=this.ele.length;
                if(!this.hasClass(className)){
                    if(length){
                        let classList=this.ele[0].getAttribute("class").trim();
                        this.ele[0].setAttribute("class",classList+" "+className);
                    }else{
                        let classList=this.ele.getAttribute("class").trim();
                        this.ele.setAttribute("class",classList+" "+className);
                    }
                }
                return this.returnValue();
            }else{
                throw "className is required or is not of the correct type";
            }
        }
    }
    //删除class类
    removeClass(className){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(className)==="[object String]"){
                //存在样式
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                let classList=ele.getAttribute("class").trim().split(" ");
                let userClassList=className.trim().split(" ");
                let length=classList.length,userLength=userClassList.length;
                for(let i=0;i<length;i++){
                    for(let j=0;j<userLength;j++){
                        if(classList[i]===userClassList[j]){
                            classList.splice(i,1);
                            continue;
                        }
                    }
                }
                ele.setAttribute("class",classList.join(" "));
                return this.returnValue();
            }else{
                throw "className is required or is not of the correct type";
            }
        }
    }
    //获取属性
    attr(name,value){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(typeof name!=="undefined"){
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                if(Object.prototype.toString.call(name)==="[object String]"){
                    if(Object.prototype.toString.call(value)==="[object String]"){
                        //设置属性
                        ele.setAttribute(name,value);
                        return this.returnValue();
                    }else{
                        //获取属性
                        return ele.getAttribute(name);
                    }
                }else if(Object.prototype.toString.call(name)==="[object Object]"){
                    //以对象的形式设置属性
                    for(var key in name){
                        ele.setAttribute(key,name[key]);
                    }
                    return this.returnValue();
                }
            }else{
                throw "name is required or is not of the correct type";
            }
        }
    }
    //删除属性
    removeAttr(name){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(name)==="[object String]"){
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                ele.removeAttribute(name);
                return this.returnValue();
            }else{
                throw "name is required or is not of the correct type";
            }
        }
    }
    /*
    * @description 添加监听
    *  @param type string 监听的事件名称
    *  @param fn function 回调的函数
    * */
    on(type,fn){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(type)==="[object String]"&&Object.prototype.toString.call(fn)==="[object Function]"){
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                this.addListener(type,fn);
                let len=this.eventList[type].length-1;
                let self=this;
                if(ele.addEventListener){
                    ele.addEventListener(type,self.eventList[type][len]);
                }else if(ele.attachEvent){
                    ele.attachEvent("on"+type,self.eventList[type][len])
                }else{
                    ele["on"+type]=self.eventList[type][len];
                }
                return this.returnValue();
            }else{
                throw "type and fn are optional, and type must be a string type, and fn must be a function";
            }
        }
    }
    //删除事件监听
    off(type,fn){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(type)==="[object String]"&&this.eventList[type]&&this.eventList[type].length>0){
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                let length=this.eventList[type].length;
                let self=this;
                if(Object.prototype.toString.call(fn)==="[object Function]"){
                    for(let i=0;i<length;i++){
                        if(fn==this.eventList[type][i]){
                            if(ele.removeEventListener){
                                ele.removeEventListener(type,self.eventList[type][i]);
                            }else if(ele.detachEvent){
                                ele.detachEvent(type,self.eventList[type][i]);
                            }else{
                                ele["on"+type]=null;
                            }
                        }
                    }
                    this.removeListener(type,fn);
                }else{
                    for(let i=0;i<length;i++){
                        if(ele.removeEventListener){
                            ele.removeEventListener(type,self.eventList[type][i]);
                        }else if(ele.detachEvent){
                            ele.detachEvent(type,self.eventList[type][i]);
                        }else{
                            ele["on"+type]=null;
                        }
                    }
                    this.removeListener(type);
                }
                return this.returnValue();
            }else{
                throw "type are optional, and type must be a string type";
            }
        }
        return this;
    }
    //获取设置html的data值
    data(key,value){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(key)==="[object String]"){
                if(Object.prototype.toString.call(value)==="[object Object]"){
                    this.attr("data-"+key,JSON.stringify(value));
                    return this;
                }else if(Object.prototype.toString.call(value)==="[object String]"){
                    this.attr("data-"+key,value);
                    return this.returnValue();
                }else{
                    return this.attr("data-"+key);
                }

            }else{
                throw "type are optional, and type must be a string type";
            }
        }
    }
    //删除设置的data属性
    removeData(key){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(key)==="[object String]"){
                this.removeAttr(key);
                return this.returnValue();
            }else{
                throw "key are optional, and key must be a string type";
            }
        }
    }
    //获取元素的宽度
    width(width){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(width)==="[object String]"||Object.prototype.toString.call(width)==="[object Number]"){
                this.css("width",width.toString());
                return this.returnValue();
            }else{
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                return ele.clientWidth;
            }
        }
    }
    //获取元素的高度
    height(height){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(Object.prototype.toString.call(height)==="[object String]"||Object.prototype.toString.call(height)==="[object Number]"){
                this.css("width",height.toString());
                return this.returnValue();
            }else{
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                return ele.clientHeight;
            }
        }
    }
    //获取当前元素的下一个元素
    next(selector){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(typeof selector==="undefined"){
                this.ele=this[0];
                let self=this;
                let ele=this.ele[0]?this.ele[0]:this.ele;
                let element=this.queryElement(selector,ele);
                self.ele=element;
                return this.returnValue();
            }else{
                let ele=this.ele[0]?this.ele[0]:this.ele;
                this.ele=ele.nextElementSibling;
                return this.returnValue();
            }
        }
    }
    //获取当前元素的下一个元素
    prev(selector){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            if(typeof selector==="undefined"){
                let self=this;
                this.ele=this[0];
                let ele=this.ele[0]?this.ele[0]:this.ele;
                let element=this.queryElement(selector,ele);
                self.ele=element;
                return this.returnValue();
            }else{
                let ele=this.ele[0]?this.ele[0]:this.ele;
                this.ele=ele.previousElementSibling;
                return this.returnValue();
            }
        }
    }
    //获取当前元素的子元素
    children(selector){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            this.ele=this[0];
            if(typeof selector==="undefined"){
                let ele=this.ele[0]?this.ele[0]:this.ele;
                this.ele=ele.children;

                return this.returnValue();
            }else{
                let self=this;
                let ele=this.ele[0]?this.ele[0]:this.ele;
                let element=this.queryElement(selector,ele);
                self.ele=element;
                return this.returnValue();
            }
        }
    }
    //获取当前元素的父元素
    parent(selector){
        if(this.ele==null){
            throw "You did not select the element";
        }else{
            this.ele=this[0];
            if(typeof selector==="undefined"){
                let ele=this.ele[0]?this.ele[0]:this.ele;
                this.ele=ele.parentNode;
                return this.returnValue();
            }else{
                let self=this;
                let length=this.ele.length,element;
                selector=selector.trim();
                let selectorList=selector.split(" ");
                if(selectorList.length>1){
                    self.ele=document;
                    return this.returnValue();
                }
                for(let i=0;i<length;i++){
                    let par=self.ele[i].parentNode;
                    if(selectorList[0].startsWith("#")){
                        if(par.getAttribute("id").trim()==selectorList[0]){
                            element=par;
                            break;
                        }
                        continue;
                    }else if(selectorList[0].startsWith(".")){
                        let className=par.getAttribute("class");
                        let classList=className.trim().split(" ");
                        for(let j=0,len=classList.length;j<len;j++){
                            if(classList[i]===selectorList[0]){
                                element=par;
                                break;
                            }
                        }
                    }else if(/^[a-zA-Z0-9_-]+$/.test(selectorList[0])){
                        let name=par.tagName.toUpperCase();
                        selectorList[0]=selectorList[0].toUpperCase();
                        if(name===selectorList[0]){
                            element=par;
                            break;
                        }
                    }

                }

                self.ele=typeof element=="undefined"?document:element;
                return this.returnValue();
            }
        }
    }
    /*
    * @description 动画效果
    * @param params object 动画传递设置类型
    * @param speed  number 动画时间
    * @param easing string 动画效果
    * @param fn  function  回调函数
    * */
    animate(params={},speed="slow",easing="linear",fn){
        if(this.ele==null){
            throw "You did not select the element";
        }else {
            let animateSpeed ={"slow":2000,"normal":1000,"fast":"500"};
            this.ele=this[0];
            let ele=this.ele[0]?this.ele[0]:this.ele;
            let self=this;
            if(isNaN(parseFloat(speed))){
                //使用的是默认的动画速度
                speed=animateSpeed[speed]||animateSpeed["slow"];
            }
            let fn1;
            if(fn&&typeof fn==="function"){
                fn1=utils.bind(fn,this);
            }
            for(let key in params){
                animate.MTween(ele,key,speed,parseFloat(params[key]),easing,fn1);
            }

            return this.returnValue();
        }
    }
    /* @description ajax请求
    * @param param object 参数类型
    *
    * */
    ajax(param){
        let paramList={
            async:true,
            beforeSend:null,
            cache:false,
            complete:null,
            contentType:"application/x-www-form-urlencoded",
            data:{},
            dataType:"json",
            timeout:1000,
            error:null,
            success:null,
            type:"GET"
        };
        if(Object.assign){
            Object.assign(paramList,param);
        }else{
            for(let key in param){
                paramList[key]=param[key];
            }
        }
        //生成xhr对象
        this.xmlHttp=null;
        if (window.ActiveXObject) {
            this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            this.xmlHttp = new XMLHttpRequest();
        }
        let isError=false,timeuid=null,self=this;
        timeuid = setTimeout(()=>{
            isError = true;
            paramList["error"].call(this,this.xmlHttp,this.xmlHttp.status);
        },parseInt(paramList["timeout"]));


        this.xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if(paramList["complete"]!=null){
                    paramList["complete"].call(this,self.xmlHttp,this.status);
                }
                if (this.status == 200) {
                    clearTimeout(timeuid);
                    if (paramList["success"] && !isError) {
                        let data=null;
                        if (paramList["dataType"].toUpperCase()==="XML") {
                            data = this.responseXML;
                        }else if(paramList["dataType"].toUpperCase()==="JSON"){
                            data = JSON.parse(this.responseText);
                        }else{
                            data =this.responseText
                        }
                        if(paramList["success"]){
                            paramList["success"].call(this,data);
                        }
                    }
                }else{
                    if(!iserror){
                        clearTimeout(timeuid);
                        if(paramList["error"]){
                            paramList["error"].call(this,this.xmlHttp,this.xmlHttp.status);
                        }
                    }
                }
            }
        };
        if(paramList["url"].length>0){
            if(paramList["type"].toUpperCase() === "GET"){
                paramList["url"] = utils.analyzetpl(paramList["url"],paramList["data"]);
                paramList["data"] = null;
            }else{
                paramList["data"] = JSON.stringify(paramList["data"]);
            }
            if(paramList["cache"]){
                let time=new Date().getTime();
                paramList["url"]=paramList["url"].indexOf("?")!=-1?paramList["url"]+"&time="+time:paramList["url"]+"?time="+time;
            }
            this.xmlHttp.setRequestHeader('Content-Type',paramList["contentType"]);
            this.xmlHttp.open(paramList["type"],paramList["url"],paramList["async"]);

            if(paramList["beforeSend"]!=null){
                paramList["beforeSend"].call(this,this.xmlHttp);
            }
            this.xmlHttp.send(paramList["data"]);
        }else{
            throw "url are optional, and url must be a string type";
        }



        console.log("paramList:",paramList);


    }
    extends(){
        let i=1,len=arguments.length,target=arguments[0],j;
        if(i==length){
            target=this;
            i--;
        }
        for(;i<len;i++){
            for(j in arguments[i]){
                target[j]=arguments[i][j];
            }
        }
        return target;
    }
}

function query(selector,context){
    return new querySelector(selector,context);
}
export {query}