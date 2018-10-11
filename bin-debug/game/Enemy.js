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
var enemyTypes;
(function (enemyTypes) {
    enemyTypes[enemyTypes["Zombie"] = 0] = "Zombie";
    enemyTypes[enemyTypes["Tank"] = 1] = "Tank";
    enemyTypes[enemyTypes["Fast"] = 2] = "Fast";
    enemyTypes[enemyTypes["Metal"] = 3] = "Metal";
    enemyTypes[enemyTypes["Baseball"] = 4] = "Baseball";
    enemyTypes[enemyTypes["Skate"] = 5] = "Skate";
})(enemyTypes || (enemyTypes = {}));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    // public dodgeChance	//闪避概率
    function Enemy(obj) {
        var _this = _super.call(this) || this;
        _this.x = obj.x;
        _this.y = obj.y;
        _this.type = obj.type;
        _this.hp = obj.hp || 2;
        _this.damage = obj.damage || 1;
        _this.exp = obj.exp || 0;
        _this.score = obj.score || 0;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    /**生产 */
    Enemy.produce = function (obj) {
        if (Enemy._pool[obj.type] == null) {
            Enemy._pool[obj.type] = [];
        }
        var theArr = Enemy._pool[obj.type];
        var theEnemy;
        if (theArr.length > 0) {
            theEnemy = theArr.pop();
            theEnemy.x = obj.x;
            theEnemy.y = obj.y;
            theEnemy.type = obj.type;
            theEnemy.hp = obj.hp || 2;
            theEnemy.damage = obj.damage || 1;
            theEnemy.exp = obj.exp || 0;
            theEnemy.score = obj.score || 0;
            console.log('从对象池中取出');
        }
        else {
            theEnemy = new Enemy(obj);
        }
        return theEnemy;
    };
    /**回收 */
    Enemy.reclaim = function (theEnemy) {
        if (Enemy._pool[theEnemy.type] == null) {
            Enemy._pool[theEnemy.type] = [];
            console.log(Enemy._pool[theEnemy.type]);
        }
        var theArr = Enemy._pool[theEnemy.type];
        if (theArr.indexOf(theEnemy) == -1) {
            theArr.push(theEnemy);
            console.log('存进对象池');
        }
    };
    Enemy.prototype.onAddToStage = function () {
        // 区别一下敌人血量
        this.hp = this.type == 0 || this.type == 2 || this.type == 4 ? 1 : 2;
        this.source = RES.getRes("GameScene-hd_json.Enemies_" + enemyTypes[this.type]);
    };
    Enemy.prototype.move = function () {
        this.y += 1;
    };
    /** 死亡*/
    Enemy.prototype.goDie = function () {
        if (this.parent) {
            Enemy.reclaim(this);
            this.parent.removeChild(this);
        }
    };
    // 保存敌人对象的对象池
    Enemy._pool = {};
    return Enemy;
}(eui.Image));
__reflect(Enemy.prototype, "Enemy");
