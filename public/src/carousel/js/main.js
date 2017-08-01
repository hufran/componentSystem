/**
 * Created by Administrator on 2017/7/19.
 *
 */
import {query} from "../../common/js/query"
import {abstractExample} from "../../common/js/abstractExample"
import {config} from "./config"
import {util} from "../../common/js/util";
let utils=new util();
/*
* var defaults = {
 direction : 'left',//left,top
 duration : 0.6,//unit:seconds
 easing : 'swing',//swing,linear
 delay : 3,//unit:seconds
 startIndex : 0,
 hideClickBar : true,
 clickBarRadius : 5,//unit:px
 hideBottomBar : false,
 width : null,
 height : null
 };
* */
class carousel extends abstractExample{
    constructor({el=null,dataList=[],skinStyle="default1",direction="left",duration=1000,easing="linear",delay=1000,startIndex=0,showClickBar=true,hideBottomBar=false,width=0,height=0}={}){
        super();
        this.el=el;
        this.dataList=dataList;
        this.skinStyle=skinStyle;
        this.direction=direction;
        this.duration=duration;
        this.easing=easing;
        this.delay=parseInt(delay);
        this.startIndex=parseInt(startIndex);
        this.showClickBar=showClickBar;
        this.hideBottomBar=hideBottomBar;
        this.width=width;
        this.height=height;
        this.timeUid=null;
        this.index=null;
        this.move=false;
        this.spacePos=0;
        this.startPos=null;
        this.moveDirection=null;
        if(this.dataList.length==0){
            throw new Error("dataList is required");
            return;
        }
        this.beforeCreate();
    }
    init(){
        this.startIndex=this.startIndex>this.dataList.length-1?this.startIndex:0;
        let tmpl=`<div class="${this.skinStyle}">
                    <ul class="items">
                        ${this.dataList.map((item,index)=>
                        `<li class="item ${!isNaN(this.startIndex)&&index==this.startIndex?'cur':''}" data-index="${index}">
                            <div class="itemsPic">
                                ${item.linkUrl?`<a href="${item.linkUrl}" target="_blank"><img src="${item.imgUrl}" alt="${item.alt}"/></a>`:`<img src="${item.imgUrl}" alt="${item.alt}"/>`}
                            </div>
                            ${item.title?(item.titleLinkUrl?`<div class="itemsTitle"><a href="${item.titleLinkUrl}" target="_blank">${item.title}</a></div>`:`<div class="itemsTitle">${item.title}</div>`):``}
                      </li>`).join('')}
                    </ul>
                    ${!this.hideBottomBar?`<ul class="bottomBar">${this.dataList.map((item,index)=>`<li class="${!isNaN(this.startIndex)&&index==this.startIndex?'cur':''}" data-index="${index}">${index}</li>`).join('')}</ul>`:``}
                    ${this.showClickBar?`<div class="clickBar"><div class="clickBarLeft" data-attr="left">&lt;</div><div class="clickBarRight" data-attr="right">&gt;</div></div>`:``}
                </div>`;
        let extendElement=(ele)=>{
            this.items=ele.children().children().eq(0);
            this.bottomBar=!this.hideBottomBar?ele.children().children().eq(1):null;
            this.clickBar=this.showClickBar?ele.children().children().eq(2):null;
            if(this.clickBar){
                this.barLeft=this.clickBar.children().eq(0);
                this.barRight=this.clickBar.children().eq(1);
            }
            this.index=this.startIndex;
            utils.loadStyle({rel:"stylesheet",href:"./css/"+this.skinStyle+".css"},()=>{
                let self=this;
                this.height=this.height||this.items.find("img").eq(0).height();
                ele.children().css({"height":self.height+"px"});
                this.width=this.width||ele.width();
                this.height=this.items.find("img").eq(0).height();
                ele.children().css({"height":self.height+"px"});
                this.items.css({"height":self.height+"px"});
                let children=this.items.children(),length=children[0].length;
                for(let i=0;i<length;i++){
                    children.eq(i).css({"z-index":1});
                }
                this.directionCompute();
                this.clickBarCompute();
                this.sliderAnimate(self.index);
            });

        };
        super.init(this.el,tmpl,extendElement);

    }
    directionCompute(){
        /*处理底部轮播按钮*/
        if(this.bottomBar){
            let children=this.items.children(),length=children[0].length,self=this;
            children.eq(self.startIndex).css({"z-index":length});
            if(this.direction=="left"||this.direction=="right"){
                let width=this.bottomBar.width(),self=this;
                this.bottomBar.css({position:"absolute",bottom:"10px",left:"50%","margin-left":-(width/2)+"px","z-index":99});
            }else if(this.direction=="up"||this.direction=="down"){
                let height=this.bottomBar.height();
                this.bottomBar.css({position:"absolute",left:"10px",top:"50%","margin-top":-(height/2)+"px","z-index":99});
            }
        }

    }
    clickBarCompute(){
        /*处理左右点击按钮*/
        if(this.clickBar){
            if(this.direction=="left"||this.direction=="right"){
                let height=this.barLeft.height();
                this.barLeft.css({position:"absolute","left":"10px",top:"50%","margin-top":-(height/2)+"px","z-index":99});
                this.barRight.css({position:"absolute","right":"10px",top:"50%","margin-top":-(height/2)+"px","z-index":99});
            }else if(this.direction=="up"||this.direction=="down"){
                let width=this.barLeft.width(),bottomBarLi=this.bottomBar.children().eq(0);
                let liWidth=bottomBarLi.width(),marginWidth=parseInt(bottomBarLi.css("marginLeft"))+parseInt(bottomBarLi.css("marginRight"));
                liWidth=liWidth+marginWidth;
                this.bottomBar.css({width:liWidth+"px"});
                this.barLeft.css({position:"absolute","top":"10px",left:"50%","z-index":99}).html("∧");
                this.barRight.css({position:"absolute","bottom":"10px",left:"50%","z-index":99}).html("∨");
            }
        }
    }
    sliderAnimate(index){
        /*滚动动画*/
        let self=this;
        if(this.timeUid){
            clearInterval(this.timeUid);
            this.timeUid=null;
        }
        if(this.dataList.length>1){
            utils.bind(self.animateGroup,self)("default",self.direction)(index);
        }
    }
    animateGroup(status,direction,index){
        let group={
            default:{
                left:(index)=>{
                    let children=this.items.children(),length=children[0].length,self=this;
                    if(!isNaN(this.delay)){
                        this.timeUid=setInterval(()=>{
                            super.beforeChange();
                            for(let i=0;i<length;i++){
                                if(parseInt(children.eq(i).css("left"))!=0||parseInt(children.eq(i).css("top"))!=0){
                                    return false;
                                }
                            }
                            let currentIndex=this.index;
                            if(this.bottomBar){
                                this.bottomBar.children().eq(self.index).removeClass("cur");
                            }
                            if(this.index+1==length){
                                this.index=0;
                                children.eq(self.index).css({"z-index":length,left:self.width+"px"});

                            }else{
                                children.eq(self.index+1).css({"z-index":length,left:self.width+"px"});
                                this.index++;
                            }
                            children.eq(currentIndex).removeClass("cur").animate({left:-self.width},self.duration,self.easing,function(){this.css({"z-index":1,left:0});});
                            if(this.bottomBar){
                                this.bottomBar.children().eq(self.index).addClass("cur");
                            }
                            children.eq(self.index).addClass("cur").css({"z-index":length}).animate({left:0},self.duration,self.easing);

                            super.changed();
                        },this.delay);
                    }
                },
                right:(index)=>{
                    /*右侧滑动动画*/
                    let children=this.items.children(),length=children[0].length,self=this;
                    if(!isNaN(this.delay)){
                        this.timeUid=setInterval(()=>{
                            super.beforeChange();
                            for(let i=0;i<length;i++){
                                if(parseInt(children.eq(i).css("left"))!=0||parseInt(children.eq(i).css("top"))!=0){
                                    return false;
                                }
                            }
                            let currentIndex=this.index;
                            if(this.index-1<0){
                                children.eq(length-1).css({"z-index":length,left:-self.width+"px"});
                                this.index=length-1;
                            }else{
                                children.eq(self.index-1).css({"z-index":length,left:-self.width+"px"});
                                this.index--;
                            }
                            if(this.bottomBar){
                                this.bottomBar.children().eq(currentIndex).removeClass("cur");
                            }
                            children.eq(currentIndex).removeClass("cur").animate({left:self.width},self.duration,self.easing,function(){this.css({"z-index":1,left:0});});
                            if(this.bottomBar){
                                this.bottomBar.children().eq(self.index).addClass("cur");
                            }
                            children.eq(self.index).addClass("cur").css({"z-index":length}).animate({left:0},self.duration,self.easing);

                            super.changed();
                        },this.delay);
                    }
                },
                up:(index)=>{
                    /*向上滑动动画*/
                    let children=this.items.children(),length=children[0].length,self=this;
                    if(!isNaN(this.delay)){
                        this.timeUid=setInterval(()=>{
                            super.beforeChange();
                            for(let i=0;i<length;i++){
                                if(parseInt(children.eq(i).css("left"))!=0||parseInt(children.eq(i).css("top"))!=0){
                                    return false;
                                }
                            }
                            let currentIndex=this.index;
                            if(this.index+1==length){
                                children.eq(0).css({"z-index":length,top:self.height+"px"});
                                this.index=0;
                            }else{
                                children.eq(this.index+1).css({"z-index":length,top:self.height+"px"});
                                this.index++;
                            }
                            if(this.bottomBar){
                                this.bottomBar.children().eq(currentIndex).removeClass("cur");
                            }
                            children.eq(currentIndex).removeClass("cur").animate({top:-self.height},self.duration,self.easing,function(){this.css({"z-index":1,top:0});});
                            if(this.bottomBar){
                                this.bottomBar.children().eq(self.index).addClass("cur");
                            }
                            children.eq(self.index).addClass("cur").css({"z-index":length}).animate({top:0},self.duration,self.easing);

                            super.changed();
                        },this.delay);
                    }
                },
                down:(index)=>{
                    /*向下滑动动画*/
                    let children=this.items.children(),length=children[0].length,self=this;
                    if(!isNaN(this.delay)){
                        this.timeUid=setInterval(()=>{
                            super.beforeChange();
                            for(let i=0;i<length;i++){
                                if(parseInt(children.eq(i).css("left"))!=0||parseInt(children.eq(i).css("top"))!=0){
                                    return false;
                                }
                            }
                            let currentIndex=this.index;
                            if(this.index-1<0){
                                children.eq(length-1).css({"z-index":length,top:-self.height+"px"});
                                this.index=length-1;
                            }else{
                                children.eq(self.index-1).css({"z-index":length,top:-self.height+"px"});
                                this.index--;
                            }
                            if(this.bottomBar){
                                this.bottomBar.children().eq(currentIndex).removeClass("cur");
                            }
                            children.eq(currentIndex).removeClass("cur").animate({top:self.height},self.duration,self.easing,function(){this.css({"z-index":1,top:0});});
                            if(this.bottomBar){
                                this.bottomBar.children().eq(self.index).addClass("cur");
                            }
                            children.eq(self.index).addClass("cur").css({"z-index":length}).animate({top:0},self.duration,self.easing);

                            super.changed();
                        },this.delay);
                    }
                },
                btnClick:(event,direction)=>{
                    /*点击操作*/
                    let self=this,target,className,pos=self.index;
                    let children=this.items.children(),length=children[0].length;
                    if(event){
                        event=event||window.event;
                        target=event.target||event.srcElement;
                        className=target.getAttribute("data-attr");
                    }else{
                        className=direction;
                    }

                    if(className=="left"){
                        if(pos+1>length-1){
                            pos=0;
                        }else if(pos+1<0){
                            pos=length-1;
                        }else{
                            pos+=1;
                        }
                        group["default"]["clickHandle"](null,pos,1);
                    }else if(className=="right"){
                        if(pos-1>length-1){
                            pos=0;
                        }else if(pos-1<0){
                            pos=length-1;
                        }else{
                            pos-=1;
                        }
                        group["default"]["clickHandle"](null,pos,-1);
                    }

                },
                clickHandle:(event,pos,spaceIndex)=>{
                    /*点击操作*/
                    let target,index,self=this,space;
                    if(event){
                        event=event||window.event;
                        target=event.target||event.srcElement;
                        index=parseInt(target.getAttribute("data-index"));
                        space=index-self.index;
                    }else{
                        index=pos;
                        space=spaceIndex;
                    }
                    if(space>0&&(this.direction=="left"||this.direction=="right")){
                        //向左滚动
                        group["default"]["clickAnimate"]("left",self.index,index,space);
                    }else if(space<0&&(this.direction=="left"||this.direction=="right")){
                        //向右滚动
                        group["default"]["clickAnimate"]("right",self.index,index,space);
                    }else if(space>0&&(this.direction=="up"||this.direction=="down")){
                        //向上滚动
                        group["default"]["clickAnimate"]("up",self.index,index,space);
                    }else if(space<0&&(this.direction=="up"||this.direction=="down")){
                        //向下滚动
                        group["default"]["clickAnimate"]("down",self.index,index,space);
                    }
                },
                clickAnimate:(direction,startIndex,endIndex,spaceIndex)=>{
                    let children=this.items.children(),length=children[0].length,self=this;
                    for(let i=0;i<length;i++){
                        if(parseInt(children.eq(i).css("left"))!=0||parseInt(children.eq(i).css("top"))!=0){
                            return false;
                        }
                    }

                    spaceIndex=Math.abs(spaceIndex);
                    if(direction=="left"){
                        let pos=startIndex;
                        children.eq(startIndex).removeClass("cur");
                        this.bottomBar.children().eq(startIndex).removeClass("cur");
                        for(let i=0;i<=spaceIndex;i++){
                            if(pos>=length-1){
                                pos=0;
                            }else{
                                pos+=1;
                            }

                            if(i==spaceIndex){
                                children.eq(startIndex).css({"z-index":length}).animate({"left":-self.width*(spaceIndex-i)},self.duration,self.easing);
                            }else{
                                children.eq(pos).css({"z-index":length,"left":self.width*(i+1)+"px"});
                                children.eq(startIndex).animate({"left":-self.width*(spaceIndex-i)},self.duration,self.easing,function(){this.css({left:0,"z-index":1})});
                            }

                            if(startIndex>=length-1){
                                startIndex=0;
                            }else{
                                startIndex+=1;
                            }
                        }

                    }else if(direction=="right"){
                        let pos=startIndex;
                        children.eq(startIndex).removeClass("cur");
                        this.bottomBar.children().eq(startIndex).removeClass("cur");
                        for(let i=0;i<=spaceIndex;i++){
                            if(pos<=0){
                                pos=length-1;
                            }else{
                                pos-=1;
                            }

                            if(i==spaceIndex){
                                children.eq(startIndex).css({"z-index":length}).animate({"left":0},self.duration,self.easing);
                            }else{
                                children.eq(pos).css({"z-index":length,"left":-self.width*(i+1)+"px"});
                                children.eq(startIndex).animate({"left":self.width*(spaceIndex-i)},self.duration,self.easing,function(){this.css({left:0,"z-index":1})});
                            }

                            if(startIndex<=0){
                                startIndex=length-1;
                            }else{
                                startIndex-=1;
                            }
                        }

                    }else if(direction=="up"){
                        let pos=startIndex;
                        children.eq(startIndex).removeClass("cur");
                        this.bottomBar.children().eq(startIndex).removeClass("cur");
                        for(let i=0;i<=spaceIndex;i++){
                            if(pos>=length-1){
                                pos=0;
                            }else{
                                pos+=1;
                            }
                            if(i==spaceIndex){
                                children.eq(startIndex).css({"z-index":length}).animate({"top":-self.height*(spaceIndex-i)},self.duration,self.easing);
                            }else{
                                children.eq(pos).css({"z-index":length,"top":self.height*(i+1)+"px"});
                                children.eq(startIndex).animate({"top":-self.height*(spaceIndex-i)},self.duration,self.easing,function(){this.css({top:0,"z-index":1})});
                            }

                            if(startIndex>=length-1){
                                startIndex=0;
                            }else{
                                startIndex+=1;
                            }
                        }

                    }else if(direction=="down"){
                        let pos=startIndex;
                        children.eq(startIndex).removeClass("cur");
                        this.bottomBar.children().eq(startIndex).removeClass("cur");
                        for(let i=0;i<=spaceIndex;i++){
                            if(pos<=0){
                                pos=length-1;
                            }else{
                                pos-=1;
                            }

                            if(i==spaceIndex){
                                children.eq(startIndex).css({"z-index":length}).animate({"top":0},self.duration,self.easing);
                            }else{
                                children.eq(pos).css({"z-index":length,"top":-self.height*(i+1)+"px"});
                                children.eq(startIndex).animate({"top":self.height*(spaceIndex-i)},self.duration,self.easing,function(){this.css({top:0,"z-index":1})});
                            }

                            if(startIndex<=0){
                                startIndex=length-1;
                            }else{
                                startIndex-=1;
                            }
                        }
                    }
                    children.eq(endIndex).addClass("cur");
                    this.bottomBar.children().eq(endIndex).addClass("cur");
                    self.index=endIndex;
                }
            }
        }
        if(group[status]&&group[status][direction]){
            return group[status][direction];
        }else{
            console.error("请输入正确的参数类型！");
        }
    }
    touchStart(event){
        event=event||window.event;
        console.log("event:",event);
        let target=event.target||event.srcElement,tagName=target.nodeName,self=this;
        let li=tagName==="IMG"?target.parentNode.parentNode:(tagName==="DIV"?target.parentNode:target);
        let children=this.items.children(),length=children[0].length;
        clearInterval(self.timeUid);
        this.timeUid=null;
        this.spacePos=0;
        if(this.direction=="left"||this.direction=="right"){
            this.startPos=event.touches[0].pageX;
        }else if(this.direction=="up"||this.direction=="down"){
            this.startPos=event.touches[0].pageY;
        }
        this.move=true;
    }
    touchMove(event){
        event=event||window.event;
        if(this.move){
            let children=this.items.children(),length=children[0].length,self=this;
            let currentPos,spacePos=0;
            if(this.direction=="left"||this.direction=="right"){
                currentPos=event.touches[0].pageX;
            }else if(this.direction=="up"||this.direction=="down"){
                currentPos=event.touches[0].pageY;
            }
            spacePos=(currentPos-this.startPos)*0.9;
            this.spacePos+=spacePos;
            if(spacePos>0){
                //向右滑动或向下滑动
                if(this.direction=="right"||this.direction=="left"){
                    this.moveDirection="right";
                    if(-self.width+self.spacePos>0){
                        //限制只允许拖拽到一张图片宽度的距离
                        return;
                    }
                    if(self.dataList.length!=2){
                        if(self.index==length-1){
                            children.eq(0).css({"z-index":length,left:self.width+self.spacePos+"px"});
                        }else{
                            children.eq(self.index+1).css({"z-index":length,left:self.width+self.spacePos+"px"});
                        }
                    }
                    children.eq(self.index).css({"z-index":length,left:self.spacePos+"px"});
                    if(this.index==0){
                        children.eq(length-1).css({"z-index":length,left:-self.width+self.spacePos+"px"});
                    }else{
                        children.eq(self.index-1).css({"z-index":length,left:-self.width+self.spacePos+"px"});
                    }
                }else{console.log("55555555555555555555555555555555555555555");
                    this.moveDirection="down";
                    if(-self.height+self.spacePos>0){
                        //限制只允许拖拽到一张图片宽度的距离
                        return;
                    }
                    if(self.dataList.length!=2){
                        if(self.index==length-1){
                            children.eq(0).css({"z-index":length,top:self.height+self.spacePos+"px"});
                        }else{
                            children.eq(self.index+1).css({"z-index":length,top:self.height+self.spacePos+"px"});
                        }
                    }
                    children.eq(self.index).css({"z-index":length,top:self.spacePos+"px"});
                    if(this.index==0){
                        children.eq(length-1).css({"z-index":length,top:-self.height+self.spacePos+"px"});
                    }else{
                        children.eq(self.index-1).css({"z-index":length,top:-self.height+self.spacePos+"px"});
                    }
                }
            }else if(spacePos<0){
                //向左滑动或向上滑动
                if(this.direction=="right"||this.direction=="left"){
                    this.moveDirection="left";
                    if(self.width+self.spacePos<0){
                        //限制只允许拖拽到一张图片宽度的距离
                        return;
                    }
                    if(self.dataList.length!=2){
                        if(this.index==0){
                            children.eq(length-1).css({"z-index":length,left:-self.width+self.spacePos+"px"});
                        }else{
                            children.eq(self.index-1).css({"z-index":length,left:-self.width+self.spacePos+"px"});
                        }
                    }
                    children.eq(self.index).css({"z-index":length,left:self.spacePos+"px"});
                    if(this.index==length-1){
                        children.eq(0).css({"z-index":length,left:self.width+self.spacePos+"px"});
                    }else{
                        children.eq(self.index+1).css({"z-index":length,left:self.width+self.spacePos+"px"});
                    }
                }else{
                    this.moveDirection="up";
                    if(self.height+self.spacePos<0){
                        //限制只允许拖拽到一张图片宽度的距离
                        return;
                    }

                    if(self.dataList.length!=2){
                        if(this.index==0){
                            children.eq(length-1).css({"z-index":length,top:-self.height+self.spacePos+"px"});
                        }else{
                            children.eq(self.index-1).css({"z-index":length,top:-self.height+self.spacePos+"px"});
                        }
                    }
                    children.eq(self.index).css({"z-index":length,top:self.spacePos+"px"});
                    if(this.index==length-1){
                        console.log();
                        children.eq(0).css({"z-index":length,top:self.height+self.spacePos+"px"});
                    }else{
                        children.eq(self.index+1).css({"z-index":length,top:self.height+self.spacePos+"px"});
                    }
                }
            }
            this.startPos+=spacePos;
            console.log("self.index:",this.index);

        }
    }
    touchEnd(event){
        if(this.move){
            let children=this.items.children(),length=children[0].length,self=this;
            this.move=false;
            if(this.direction=="left"||this.direction=="right"){
                if(this.spacePos>self.width/2||this.spacePos<-self.width/2){
                    this.bottomBar.children().eq(self.index).removeClass("cur");
                    if(this.moveDirection=="left"){
                        if(self.dataList.length!=2){
                            if(this.index==0){
                                children.eq(length-1).css({"z-index":1,left:"0px"});
                            }else{
                                children.eq(self.index-1).css({"z-index":1,left:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length}).animate({left:-self.width},300,self.easing,function(){this.css({left:0,"z-index":1})});
                        if(self.index==length-1){
                            children.eq(0).css({"z-index":length}).animate({left:0},300,self.easing);
                            self.index=0;
                        }else{
                            children.eq(self.index+1).css({"z-index":length}).animate({left:0},300,self.easing);
                            self.index+=1;
                        }
                    }else if(this.moveDirection=="right"){
                        if(self.dataList.length!=2){
                            if(this.index==length-1){
                                children.eq(0).css({"z-index":1,left:"0px"});
                            }else{
                                children.eq(self.index+1).css({"z-index":1,left:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length}).animate({left:self.width},300,self.easing,function(){this.css({left:0,"z-index":1})});
                        if(self.index==0){
                            children.eq(length-1).css({"z-index":length}).animate({left:0},300,self.easing);
                            self.index=length-1;
                        }else{
                            children.eq(self.index-1).css({"z-index":length}).animate({left:0},300,self.easing);
                            self.index-=1;
                        }
                    }
                    this.bottomBar.children().eq(self.index).addClass("cur");
                }else{
                    if(this.moveDirection=="left"){
                        if(self.dataList.length!=2){
                            if(this.index==0){
                                children.eq(length-1).css({"z-index":1,left:"0px"});
                            }else{
                                children.eq(self.index-1).css({"z-index":1,left:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length,"left":0});
                        if(self.index==length-1){
                            children.eq(0).css({"z-index":1,"left":0});
                        }else{
                            children.eq(self.index+1).css({"z-index":1,"left":0});
                        }
                    }else if(this.moveDirection=="right"){
                        if(self.dataList.length!=2){
                            if(this.index==length-1){
                                children.eq(0).css({"z-index":1,left:"0px"});
                            }else{
                                children.eq(self.index+1).css({"z-index":1,left:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length,left:0});
                        if(self.index==0){
                            children.eq(length-1).css({"z-index":1,left:0});
                        }else{
                            children.eq(self.index-1).css({"z-index":1,left:0});
                        }
                    }
                }
            }else if(this.direction=="up"||this.direction=="down"){
                if(this.spacePos>self.height/2||this.spacePos<-self.height/2){
                    this.bottomBar.children().eq(self.index).removeClass("cur");
                    if(this.moveDirection=="up"){
                        if(self.dataList.length!=2){
                            if(this.index==0){
                                children.eq(length-1).css({"z-index":1,top:"0px"});
                            }else{
                                children.eq(self.index-1).css({"z-index":1,top:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length}).animate({top:-self.height},300,self.easing,function(){this.css({top:0,"z-index":1})});
                        if(self.index==length-1){
                            children.eq(0).css({"z-index":length}).animate({top:0},300,self.easing);
                            self.index=0;
                        }else{
                            children.eq(self.index+1).css({"z-index":length}).animate({top:0},300,self.easing);
                            self.index+=1;
                        }
                    }else if(this.moveDirection=="down"){
                        if(self.dataList.length!=2){
                            if(this.index==length-1){
                                children.eq(0).css({"z-index":1,top:"0px"});
                            }else{
                                children.eq(self.index+1).css({"z-index":1,top:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length}).animate({top:self.height},300,self.easing,function(){this.css({top:0,"z-index":1})});
                        if(self.index==0){
                            children.eq(length-1).css({"z-index":length}).animate({top:0},300,self.easing);
                            self.index=length-1;
                        }else{
                            children.eq(self.index-1).css({"z-index":length}).animate({top:0},300,self.easing);
                            self.index-=1;
                        }
                    }
                    this.bottomBar.children().eq(self.index).addClass("cur");
                }else{
                    if(this.moveDirection=="up"){
                        if(self.dataList.length!=2){
                            if(this.index==0){
                                children.eq(length-1).css({"z-index":1,top:"0px"});
                            }else{
                                children.eq(self.index-1).css({"z-index":1,top:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length,"top":"0px"});
                        if(self.index==length-1){
                            children.eq(0).css({"z-index":1,"top":0});
                        }else{
                            children.eq(self.index+1).css({"z-index":1,"top":0});
                        }
                    }else if(this.moveDirection=="down"){
                        if(self.dataList.length!=2){
                            if(this.index==length-1){
                                children.eq(0).css({"z-index":1,top:"0px"});
                            }else{
                                children.eq(self.index+1).css({"z-index":1,top:"0px"});
                            }
                        }
                        children.eq(self.index).css({"z-index":length,"top":"0px"});
                        if(self.index==0){
                            children.eq(length-1).css({"z-index":1,"top":"0"});
                        }else{
                            children.eq(self.index-1).css({"z-index":1,"top":"0"});
                        }
                    }
                }
            }
            utils.bind(self.animateGroup,self)("default",self.direction)(self.index);
            this.startPos=0;
            this.spacePos=0;
            this.moveDirection=null;
        }
    }
    enterDocument(){
        let self =this;
        if(this.clickBar){
            this.barLeft.on("click",utils.bind(self.animateGroup,self)("default","btnClick"));
            this.barRight.on("click",utils.bind(self.animateGroup,self)("default","btnClick"));
        }
        if(this.bottomBar){
            this.bottomBar.on("click",utils.bind(self.animateGroup,self)("default","clickHandle"));
        }
        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch){
            this.items.on("touchstart",utils.bind(self.touchStart,self));
            query(document).on("touchmove",utils.bind(self.touchMove,self));
            query(document).on("touchend",utils.bind(self.touchEnd,self));
        }
    }
    destoryDocument(){
        let extendElement=function(){
            this.dataList=null;
            this.skinStyle=null;
            this.direction=null;
            this.duration=null;
            this.easing=null;
            this.delay=null;
            this.startIndex=null;
            this.showClickBar=null;
            this.hideBottomBar=null;
            this.width=null;
            this.height=null;
            this.timeUid=null;
            this.index=null;
            this.move=null;
            this.startPos=null;
            this.moveDirection=null;
            this.spacePos=null;
        };
        utils.bind(extendElement,this);
        super.destoryDocument(extendElement);
    }
}

//组件初始化
window.carousel=carousel;