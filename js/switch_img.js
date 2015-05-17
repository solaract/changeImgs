/**
 * Created by zxy on 2015/5/2.
 */
function extend(obj, extension){
    for(var key in extension){
        if(extension.hasOwnProperty(key) && obj[key] == null){
            obj[key] = extension[key];
        }
    }
    return obj;
}
var switch_img = (function(){
    var Constructer = function(img_info){
        var speed,target,waitTime;
        if(typeof img_info.speed === 'number'||typeof img_info.waitTime === 'number'){
            speed = img_info.speed;
            waitTime = img_info.waitTime;
        }
        else{
            throw "speed or waitTime should be a number";
        }
        if(img_info.target){
            typeof img_info.target == "string"?target = document.getElementById(img_info.target):target = img_info.target;
        }
        else{
            throw "img_info['target'] should be a HTML object]";
        }
        this.getSpeed = function(){
            return speed;
        };
        this.getTarget = function(){
            return target;
        };
        this.getWait = function(){
            return waitTime;
        };
//        var len = img_info.len||0;
//        this.speed = img_info.speed;
//        this.get_len = function(){
//            return len;
//        }
    };
    var change = {
        //第n个图片
        nImg:0,
        //保存图片位置
        imgPosition:[],
        //动画结束后执行
        swiched:[],
        //判断图片是否都加载完成
        isImgsLoad:function(target,cb){
            var isLaod,imgs,i,len,loadImg,getImgStyle;
            isLaod = true;
            if(document.getElementsByClassName){
                imgs = document.getElementsByClassName('chaImg');
            }
            else{
                imgs = target.getElementsByTagName('img');
            }
            len = imgs.length;
            for(i = 0;i<len;i++){
                getImgStyle = this.getStyle(imgs[i]);
//                console.log(parseInt(getImgStyle('height')));
                if(parseInt(getImgStyle('height')) === 0){
                    isLaod = false;
                    break;
                }
            }
            if(isLaod){
                if(loadImg){
                    clearTimeout(loadImg);
                }
//                alert(1);
                cb();
            }
            else{
                isLaod = true;
                loadImg = setTimeout(function(){
                    change.isImgsLoad(target,cb);
                },500);
            }
        },
        //获得计算样式
        getStyle:function(target){
            if(target.currentStyle){
                return function(cssStyle){
                    return target.currentStyle[cssStyle];
                };
            }
            else{
                return function(cssStyle){
                    return getComputedStyle(target)[cssStyle];
                }
            }
        },
        //下一个图片位置
        calDistance:function(){
            var len = this.imgPosition.length;
            this.nImg = (this.nImg<(len-1))?(this.nImg+1):0;
            return this.imgPosition[this.nImg];
        },
        //位置长度动画函数
        animate:function(cssStyle,target,speed){
            //保存this对象
            var that = this;
            //css属性名称
            var css = [];
            //开始时css属性名值对对象
            var nowCss = {};
            //css属性公式名值对对象
            var formula = {};
            //开始时间
            var time = new Date().getTime();
            //获得计算样式的函数
            var getSty = this.getStyle(target);
            //返回公式对象方法的函数
            var formu = function(key){
                return function(t){
                    return cssStyle[key]*Math.sqrt(t/speed);
                }
            };
            //遍历要改变css属性的名值对对象
            for(var key in cssStyle){
                //非原型继承
                if(cssStyle.hasOwnProperty(key)){
                    //值数字化
                    cssStyle[key] = parseInt(cssStyle[key]);
                    //保存css名称
                    css.push(key);
                    //定义公式对象的方法
                    formula[key] = formu(key);
                    //开始时css属性对象赋值，数值
                    nowCss[key] = parseInt(getSty(key));
                }
            }
            //要改变的css个数
            var cssLen = css.length;

            return function ani(){
                //当前时间
                var nowTime = new Date().getTime();
                //已用时间
                var useTime = nowTime-time;
                var i;
//                var key;
                //动画未结束
                if(useTime<speed){
                    for(i = 0;i<cssLen;i++){
                        //原位置+计算长度
                        target.style[css[i]] = (nowCss[css[i]]+formula[css[i]](useTime))+'px';
                    }
                    //自调用，50帧
                    return setTimeout(ani,20);
                }
                //动画已结束
                else{
                    for(i = 0;i<cssLen;i++){
                        //原位置+总距离
                        target.style[css[i]] = (nowCss[css[i]]+cssStyle[css[i]])+'px';
                    }
                    var len = that.swiched.length;
                    for(i = 0;i<len;i++){
                        that.swiched[i]();
                    }
                }
            }
        }
    };
    Constructer.prototype.run = function(){
        var target = this.getTarget();
        var speed = this.getSpeed();
        var waitTime = this.getWait();
        var allTime = speed+waitTime;
        var getTargetStyle = change.getStyle(target);
        var imgLoaded = function(){
            var imgs,imgLen,getImgStyle,begainLeft,imgsN,swtichImg;
            if(document.getElementsByClassName){
                imgs = document.getElementsByClassName('chaImg');
            }
            else{
                imgs = target.getElementsByTagName('img');
            }
            getImgStyle = change.getStyle(imgs[0]);
            imgLen = parseInt(getImgStyle('width'));
            if(!parseInt(getTargetStyle('left'))){

            }
            begainLeft = parseInt(getTargetStyle('left'));
            imgsN = imgs.length;
            for(var i = 0;i<imgsN;i++){
                change.imgPosition.push(begainLeft+i*imgLen);
            }
//            console.log(change.imgPosition);
            swtichImg = setTimeout(chanImg,waitTime);
        };
        change.swiched.push(function(){
            setTimeout(chanImg,waitTime);
        });
        var chanImg = function(){
            var nowLeft,left,distance,cssStyle;
            nowLeft = change.imgPosition[change.nImg];
//            console.log(nowLeft);
            left = change.calDistance();
            distance = nowLeft-left;
//            console.log(distance);
            cssStyle = {};
            cssStyle['left'] = distance;
            change.animate(cssStyle,target,speed)();
        };
        change.isImgsLoad(target,imgLoaded);
    };
    return Constructer;
})();
var a = new switch_img({
    target:'allImgs',
    speed:500,
    waitTime:4000
});
a.run();