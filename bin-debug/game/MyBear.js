var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var MyBear = (function (_super) {
    __extends(MyBear, _super);
    function MyBear() {
        var _this = _super.call(this) || this;
        _this.texture = RES.getRes('GameScene-hd_json.Enemies_Fast');
        _this.hp = 5;
        _this.touchEnabled = true;
        return _this;
    }
    MyBear.prototype.init = function () {
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP)
    };
    return MyBear;
}(egret.Bitmap));
__reflect(MyBear.prototype, "MyBear");
