/**
 * Created by zxy on 2014/11/22.
 */
//扩展
function extend(obj, extension){
    for(var key in extension){
        if(extension.hasOwnProperty(key) && obj[key] == null){
            obj[key] = extension[key];
        }
    }
    return obj;
}
var img_move=(function(){
    var callMe =function(changeImg,target){
        this.changeImg=extend(changeImg,changeImg_Default);
        this.target=target;
    };
    var changeImg_Default={
        back:function(imgs,begainLeft){
            var begainLeft=begainLeft;
            var imgs=imgs;
            var img_txt=imgs.next();
            img_txt.animate({bottom:'-40px'});
            if(swich_now)clearTimeout(swich);
            if(toBack_now)clearTimeout(toBack_now);
            return function back_now(){
                if(swich)clearTimeout(swich);
                var nowLeft=imgs.position().left;//现在所处的位置
                var backDistance=(begainLeft-nowLeft);//现在位置到终点的距离
                // console.log(backDistance);
                //缩短距离
                if(backDistance>10){
                    imgs.offset(function(index, current) {
                        return {left:current.left+backDistance/10,top:current.top};
                    })
                }
                else{
                    var imgsPosition=imgs.offset();
                    imgsPosition.left+=backDistance;
                    imgs.offset(imgsPosition);
                    img_txt.animate({bottom:'0px'});
                }
                // console.log(isChange);
                //自调用
//                console.log('toBack:'+toBack_now);
                if(imgs.position().left!=begainLeft) {
                    toBack_now=true;
                    return toBack = setTimeout(back_now, 20);
                }
                toBack_now=false;
            }


        },
        change:function(imgs,endLeft){
            var imgs=imgs;
            var endLeft=endLeft;
            var img_txt=imgs.next();
            img_txt.animate({bottom:'-40px'});
            if(swich_now)clearTimeout(swich);
            if(toBack_now)clearTimeout(toBack_now);
            return function change_now(){
                var nowLeft=imgs.position().left;//现在所处的位置
                var distance=(nowLeft-endLeft);//现在位置到终点的距离
                // console.log('distance:'+distance);
                //缩短距离
                if (distance > 6||distance<-6) {
                    imgs.offset(function (index, current) {
                        return {left: current.left - distance / 6, top: current.top};
                    })
                }
                else {
                    var imgsPosition = imgs.offset();
                    imgsPosition.left -= distance;
                    imgs.offset(imgsPosition);
                    img_txt.animate({bottom:'0px'});
                }


                //自调用
//                console.log('swich:'+swich_now);
                if (imgs.position().left != endLeft) {
                    swich_now=true;
                    return swich = setTimeout(change_now, 20);
                }
                swich_now=false;
            }

        }

    };
    callMe.prototype.run=function(){
        swich_now=false;
        toBack_now=false;
        var changeImg=this.changeImg;
        var target=this.target;
        var imgs;
        typeof target=="string"?imgs=document.getElementById(target):imgs=target;
        imgs=$(imgs);
        var links=imgs.parent().find('li');
        var chaImg=imgs.find('img');
        var imgWith=chaImg.width();         //图片宽度
//        var begainLeft=imgs.offset().left;	//获取最初的位置
        var begainLeft=imgs.position().left;//由offset取得的是图片左侧距离浏览器左侧的距离
//        parseInt(imgs.css('left'))效果同上
//        var links_begain=begainLeft+imgWith;//links_left起点
        var links_left=[];
        links_left[0]=begainLeft;
        var len=links.length;
        for(var i= 0;i<len-1;i++){
            links_left[i+1]=links_left[i]-imgWith;
        }
        var back=imgs.width()-imgWith;
//        console.log(begainLeft);
//        console.log(back);
        function moveStart(){

            var endLeft=imgs.position().left-imgWith;//获取最终要到达的位置
            // console.log('begain:'+begainLeft+';end:'+endLeft);
            //拉回起点
            if(begainLeft-imgs.position().left>=back)changeImg.back(imgs,begainLeft)();
            //切换一个图片
            else{changeImg.change(imgs,endLeft)()}
        }
        var changeStart=setInterval(moveStart,6000);
        setInterval(function(){
            var now_left=imgs.position().left;
            var img_p=imgs.next().find('p');
            switch(now_left){
                case links_left[0]:
                    links.each(function(){
                        $(this).css({"background-color":"#ffffff"});
                    });
                    $(links[0]).css({"background-color":"#3e96e8"});
                    img_p.each(function(){
                        $(this).css({'display':'none'});
                    });
                    $(img_p[0]).css({'display':'block'});
                    break;
                case links_left[1]:
                    links.each(function(){
                        $(this).css({"background-color":"#ffffff"});
                    });
                    $(links[1]).css({"background-color":"#3e96e8"});
                    img_p.each(function(){
                        $(this).css({'display':'none'});
                    });
                    $(img_p[1]).css({'display':'block'});
                    break;
                case links_left[2]:
                    links.each(function(){
                        $(this).css({"background-color":"#ffffff"});
                    });
                    $(links[2]).css({"background-color":"#3e96e8"});
                    img_p.each(function(){
                        $(this).css({'display':'none'});
                    });
                    $(img_p[2]).css({'display':'block'});
                    break;
                case links_left[3]:
                    links.each(function(){
                        $(this).css({"background-color":"#ffffff"});
                    });
                    $(links[3]).css({"background-color":"#3e96e8"});
                    img_p.each(function(){
                        $(this).css({'display':'none'});
                    });
                    $(img_p[3]).css({'display':'block'});
                    break;
                case links_left[4]:
                    links.each(function(){
                        $(this).css({"background-color":"#ffffff"});
                    });
                    $(links[4]).css({"background-color":"#3e96e8"});
                    img_p.each(function(){
                        $(this).css({'display':'none'});
                    });
                    $(img_p[4]).css({'display':'block'});
                    break;
            }
        },100);
        var links_1=links_left[0];
        var links_2=links_left[1];
        var links_3=links_left[2];
        var links_4=links_left[3];
        var links_5=links_left[4];
        $(links[0]).bind('click',function(){
            if(changeStart)clearInterval(changeStart);
            changeImg.change(imgs,links_1)();
            changeStart=setInterval(moveStart,4000);
        });
        $(links[1]).bind('click',function(){
            if(changeStart)clearInterval(changeStart);
            changeImg.change(imgs,links_2)();
            changeStart=setInterval(moveStart,4000);
        });
        $(links[2]).bind('click',function(){
            if(changeStart)clearInterval(changeStart);
            changeImg.change(imgs,links_3)();
            changeStart=setInterval(moveStart,4000);
        });
        $(links[3]).bind('click',function(){
            if(changeStart)clearInterval(changeStart);
            changeImg.change(imgs,links_4)();
            changeStart=setInterval(moveStart,4000);
        });
        $(links[4]).bind('click',function(){
            if(changeStart)clearInterval(changeStart);
            changeImg.change(imgs,links_5)();
            changeStart=setInterval(moveStart,4000);
        });
        setInterval(function(){
            if(imgs.offset().left<(begainLeft-4*imgWith))changeImg.back(imgs,begainLeft)();
        },100);
//        for(var j=0;j<len;j++){
//            $(links[j]).bind('click',function(){
//                if(changeStart)clearTimeout(changeStart);
//                changeImg.change(imgs,links_left[j])();
//                changeStart=setInterval(moveStart,4000);
//            });
//
//            alert(links_left[j]);
//
//        }
    };
    return callMe;
})();
