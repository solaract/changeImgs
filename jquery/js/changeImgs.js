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
        change:function(target,array,n){
            var imgs=target;
            var imgs_left=array;
//            console.log(imgs_left);
            var len=imgs_left.length;
//            console.log('n:'+n);
            var num=(n<(len-1))?(n+1):0;
//            console.log(num);
            var endLeft=imgs_left[num];
//            console.log('end:'+endLeft);
            //获取说明栏
            var img_p=imgs.parent().find('p');
            var img_txt=img_p.parent().parent();
            //获取说明栏高度
            var height=img_txt.css('height');
            //调整links颜色
            var links=imgs.parent().find('li');
            links.each(function(){
                $(this).css({"background-color":"#ffffff"});
            });
            $(links[num]).css({"background-color":"#3e96e8"});
            //隐藏说明栏
            if(endLeft!==imgs.position().left)img_txt.animate({bottom:'-'+height});
            //清除时间线上其他swich
            if(swich_now)clearTimeout(swich);
            return function change_now(){
                var nowLeft=imgs.position().left;//现在所处的位置
                var distance=(nowLeft-endLeft);//现在位置到终点的距离
//                console.log('distance:'+distance);
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
                    //转换说明
                    img_p.each(function(){
                        $(this).css({'display':'none'});
                    });
                    $(img_p[num]).css({'display':'block'});
                    //显示说明栏
                    img_txt.animate({bottom:'0px'});
                }


                //自调用
//                console.log('swich:'+swich_now);
                if (imgs.position().left != endLeft) {
                    swich_now=true;
                    swich = setTimeout(change_now, 20);
                }
                else{
                    swich_now=false;
//                    console.log('num:'+num);
                }
                return num;

            }

        }
    };
    callMe.prototype.run=function(){
        swich_now=false;
        var changeImg=this.changeImg;
        var target=this.target;
        var imgs;
        typeof target=="string"?imgs=document.getElementById(target):imgs=target;
        imgs=$(imgs);

        var chaImg=imgs.find('img');
        var imgWith=chaImg.width();         //图片宽度
//        var begainLeft=imgs.offset().left;	//获取最初的位置
        var begainLeft=imgs.position().left;//由offset取得的是图片左侧距离浏览器左侧的距离
//        parseInt(imgs.css('left'))效果同上
        //取每个图片的left值
        var imgs_left=[];
        imgs_left[0]=begainLeft;
        var len =chaImg.length;
        for(var i= 0;i<len-1;i++){
            imgs_left[i+1]=imgs_left[i]-imgWith;
        }
        var num=0;
//        console.log(imgs_left);
        //调用change函数开始切换图片
        function moveStart(){
            num=changeImg.change(imgs,imgs_left,num)();
//            console.log('numsssss:'+num);
        }
        var changeStart=setInterval(moveStart,6000);
        var links=imgs.parent().find('li');
        $(links[0]).css({"background-color":"#3e96e8"});
        //每个link加上序号
        for(var j=0;j<len;j++){
            $(links[j]).attr({'n':j});
        }
        //加上点击效果
        links.bind('click',function(){
             if(changeStart)clearInterval(changeStart);
             var n=parseInt($(this).attr('n'))-1;
             num=changeImg.change(imgs,imgs_left,n)();
             changeStart=setInterval(moveStart,4000);
         });
        setInterval(function(){
            if(imgs.offset().left<(begainLeft-4*imgWith))changeImg.back(imgs,begainLeft)();
        },100);
    };
    return callMe;
})();
var a= new img_move({},allImgs);
a.run();
