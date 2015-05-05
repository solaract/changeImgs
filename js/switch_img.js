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
        var len = img_info.len||0;
        this.speed = img_info.speed;
        this.get_len = function(){
            return len;
        }
    };
    var change = {
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
        animate:function(cssStyle,target,speed){
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
                var key;
                //动画未结束
                if(useTime<speed){
                    for(i = 0;i<cssLen;i++){
                        //原位置+计算长度
                        target.style[css[i]] = (nowCss[css[i]]+formula[css[i]](useTime))+'px';
                    }
                    //自调用，40帧
                    return setTimeout(ani,25);
                }
                //动画已结束
                else{
                    for(i = 0;i<cssLen;i++){
                        //原位置+总距离
                        target.style[css[i]] = (nowCss[css[i]]+cssStyle[css[i]])+'px';
                    }
                }
            }
        }
    }
})();