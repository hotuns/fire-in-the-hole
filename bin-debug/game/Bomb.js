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
// enum craters {
// 	'GameScene-hd_json.GameScene_MarcaPiso1', 'GameScene-hd_json.GameScene_MarcaPiso2', 'GameScene-hd_json.GameScene_MarcaPisoCritical',
// }
var Bomb = (function (_super) {
    __extends(Bomb, _super);
    function Bomb() {
        var _this = _super.call(this) || this;
        _this.source = RES.getRes('GameScene-hd_json.GameScene_Granada');
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
        return _this;
    }
    Bomb.prototype.init = function () {
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
    };
    /**爆炸 */
    Bomb.prototype.booming = function () {
        var _this = this;
        this.isHit();
        this.source = RES.getRes('GameScene-hd_json.GameScene_Explosion');
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        var tw = egret.Tween.get(this);
        tw.to({ scaleX: 1.5, scaleY: 1.5, alpha: 0.5 }, 200).call(function () {
            _this.finish();
        });
    };
    /**爆炸完成 */
    Bomb.prototype.finish = function () {
        var _this = this;
        var randownNum = Math.floor(Math.random()) * 3 + 1;
        this.source = RES.getRes("GameScene-hd_json.GameScene_MarcaPiso" + randownNum);
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        setTimeout(function () {
            _this.parent.removeChild(_this);
        }, 700);
    };
    /**是否击中 */
    Bomb.prototype.isHit = function () {
        for (var i = SceneManager.instance.gamescene.enemysArr.length - 1; i >= 0; i--) {
            var theEnemy = SceneManager.instance.gamescene.enemysArr[i];
            if (SceneManager.hitTest(theEnemy, this)) {
                console.log(theEnemy.hp);
                theEnemy.hp -= 1;
            }
        }
    };
    return Bomb;
}(eui.Image));
__reflect(Bomb.prototype, "Bomb");
