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
var Door = (function (_super) {
    __extends(Door, _super);
    function Door() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Door.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    Door.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    Door.prototype.onAddToStage = function () {
        this.toggle();
    };
    Door.prototype.toggle = function () {
        var _this = this;
        var tw_left = egret.Tween.get(this.gro_left);
        tw_left.to({ x: 0 }, 500, egret.Ease.quadIn).to({ x: -640 }, 1000, egret.Ease.quadIn);
        var tw_right = egret.Tween.get(this.gro_right);
        tw_right.to({ x: 320 }, 500, egret.Ease.quadIn).to({ x: 960 }, 1000, egret.Ease.quadIn).call(function () {
            SceneManager.removeScene(_this);
        });
    };
    return Door;
}(eui.Component));
__reflect(Door.prototype, "Door", ["eui.UIComponent", "egret.DisplayObject"]);
