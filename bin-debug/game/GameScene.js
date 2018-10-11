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
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this) || this;
        _this.tweenArr = []; // 缓动动画组
        _this.enemysArr = [];
        /**得分 */
        _this.scoreText = 0;
        return _this;
    }
    GameScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    GameScene.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        // 创建主角
        this.myBear = new MyBear();
        this.myBear.anchorOffsetX = this.myBear.width / 2;
        this.myBear.anchorOffsetY = this.myBear.height / 2;
        this.myBear.x = this.stage.stageWidth / 2;
        this.myBear.y = 720;
        // 创建准心位置图片
        this.aimImg = new egret.Bitmap();
        this.aimImg.texture = RES.getRes('GameScene-hd_json.GameScene_Mira');
        this.aimImg.anchorOffsetX = this.aimImg.width / 2;
        this.aimImg.anchorOffsetY = this.aimImg.height / 2;
        this.aimImg.alpha = 0.7;
        // 创建爆炸图片
        this.boomImg = new egret.Bitmap();
        this.boomImg.texture = RES.getRes('GameScene-hd_json.GameScene_Explosion');
        this.boomImg.anchorOffsetX = this.boomImg.width / 2;
        this.boomImg.anchorOffsetY = this.boomImg.height / 2;
        // 提示 tip 动画
        this.tip.addEventListener('complete', this.onTweenGroupComplete, this);
        this.btn_closeTip.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // 点击关闭后
            _this.gro_tip.visible = false;
            _this.tip.stop();
            _this.init();
        }, this);
        this.btn_pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gamePause, this);
        this.tip.play();
    };
    // 初始化
    GameScene.prototype.init = function () {
        var _this = this;
        // 显示准备开始
        egret.Tween.get(this.tip_ready).to({ alpha: 1 }).to({ alpha: 0 }, 500).call(function () {
            egret.Tween.get(_this.tip_go).to({ alpha: 1 }).to({ alpha: 0 }, 500).call(function () {
                // 游戏开始
                _this.mask1.visible = false;
                _this.scoreText = 0;
                // 添加主角到舞台
                _this.addChildAt(_this.myBear, _this.numChildren - 3);
                // 心跳开始
                egret.startTick(_this.updata, _this);
                _this.tickTime = egret.getTimer();
            });
        });
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
    };
    /**创建敌人,添加到数组 */
    GameScene.prototype.createEnemy = function () {
        var enemyType = Math.floor(Math.random() * 6);
        var enemyX = Math.floor(Math.random() * 640 + 1);
        var enmeyY = -175;
        enemyX = Math.max(enemyX, 0);
        enemyX = Math.min(enemyX, this.stage.stageWidth - 122);
        var newEnemy = Enemy.produce({ x: enemyX, y: enmeyY, type: enemyType });
        this.addChildAt(newEnemy, this.numChildren - 10);
        this.enemysArr.push(newEnemy);
    };
    /**更新 */
    GameScene.prototype.updata = function (timeStamp) {
        this.num_hp.text = this.myBear.hp.toString();
        this.num_score.text = this.scoreText.toString();
        if (timeStamp - this.tickTime >= 3000) {
            this.tickTime = timeStamp;
            // 创建敌人
            this.createEnemy();
        }
        // 敌人移动
        if (this.enemysArr.length > 0) {
            for (var i = this.enemysArr.length - 1; i >= 0; i--) {
                var item = this.enemysArr[i];
                // 判断敌人血量
                if (item.hp > 0) {
                    // 判断是否抵达
                    if (item.y === 720) {
                        // this.myBear.hp -= 1
                        this.gameOver();
                    }
                    // 超出屏幕删除
                    if (item.y >= this.stage.stageHeight) {
                        console.log('超出屏幕');
                        item.goDie();
                        this.enemysArr.splice(i, 1);
                        continue;
                    }
                    item.move();
                }
                else {
                    item.goDie();
                    this.enemysArr.splice(i, 1);
                    this.scoreText += 1;
                }
            }
        }
        return false;
    };
    /**tween组完成,循环播放 */
    GameScene.prototype.onTweenGroupComplete = function () {
        this.tip.play(0);
    };
    /**滑动开始 */
    GameScene.prototype.touchBegin = function (e) {
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        if (e.target === this.myBear) {
            this.isMove = true;
            this.addChild(this.aimImg);
            this.pointEnd = new egret.Point(e.stageX, e.stageY);
            this.showAim();
        }
    };
    /**滑动过程 */
    GameScene.prototype.touchMove = function (e) {
        if (this.isMove) {
            this.pointEnd = new egret.Point(e.stageX, e.stageY);
            this.showAim();
        }
    };
    /**滑动结束 */
    GameScene.prototype.touchEnd = function (e) {
        if (this.isMove) {
            this.removeChild(this.aimImg);
            this.showBomb();
            this.isMove = false;
        }
    };
    /**显示瞄准器 */
    GameScene.prototype.showAim = function () {
        this.pointBoom = new egret.Point();
        var x1 = this.myBear.x;
        var y1 = this.myBear.y;
        var k = (this.pointEnd.y - y1) / (this.pointEnd.x - x1);
        var jvli = (this.pointEnd.y - y1) * 3;
        this.pointBoom.x = x1 - (jvli / k);
        this.pointBoom.y = y1 - jvli;
        this.pointBoom.x = Math.max(this.pointBoom.x, 0 + (this.aimImg.width / 2));
        this.pointBoom.x = Math.min(this.pointBoom.x, this.stage.stageWidth - (this.aimImg.width / 2));
        this.pointBoom.y = Math.max(this.pointBoom.y, 0 + (this.aimImg.height / 2));
        this.pointBoom.y = Math.min(this.pointBoom.y, this.stage.stageHeight - (this.aimImg.height / 2));
        this.aimImg.x = this.pointBoom.x;
        this.aimImg.y = this.pointBoom.y;
    };
    /**显示炸弹 */
    GameScene.prototype.showBomb = function () {
        var _this = this;
        // 创建炸弹
        var bomb = new Bomb();
        bomb.x = this.myBear.x;
        bomb.y = this.myBear.y - 10;
        this.addChild(bomb);
        var a = Math.abs((bomb.x - this.pointBoom.x));
        var b = Math.abs((bomb.y - this.pointBoom.y));
        var c = Math.sqrt(a * a + b * b);
        var time = Math.abs(c * 3);
        var tw1 = egret.Tween.get(bomb).to({ scaleX: 0.5, scaleY: 0.5 }).to({ scaleX: 1.2, scaleY: 1.2 }, time / 2).to({ scaleX: 0.7, scaleY: 0.7 }, time / 2);
        var tw2 = egret.Tween.get(bomb).to({ x: this.pointBoom.x, y: this.pointBoom.y, rotation: 360 }, time).call(function () {
            egret.Tween.removeTweens(bomb);
            _this.tweenArr.splice(_this.tweenArr.indexOf(tw1), 1);
            _this.tweenArr.splice(_this.tweenArr.indexOf(tw2), 1);
            bomb.booming();
            var tw3 = egret.Tween.get(_this)
                .to({ x: 20, y: 10 }, 30)
                .to({ x: -10, y: 0 }, 30)
                .to({ x: 0, y: -20 }, 30)
                .to({ x: -30, y: 40 }, 30)
                .to({ x: 40, y: 0 }, 30)
                .to({ x: 10, y: 30 }, 30)
                .to({ x: 10, y: 10 }, 30)
                .to({ x: 0, y: 0 }, 30).call(function () {
                egret.Tween.removeTweens(tw3);
            });
        });
        this.tweenArr.push(tw1);
        this.tweenArr.push(tw2);
    };
    /**游戏结束 */
    GameScene.prototype.gameOver = function () {
        egret.stopTick(this.updata, this);
        this.enemysArr.forEach(function (item) {
            item.goDie();
        });
        this.enemysArr = [];
        this.setChildIndex(this.mask1, this.numChildren - 1);
        this.mask1.visible = true;
        this.setChildIndex(this.gro_over, this.numChildren - 1);
        this.gro_over.visible = true;
        this.num_end_score.text = this.scoreText.toString();
        this.btn_restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reStart, this);
    };
    /**游戏暂停 */
    GameScene.prototype.gamePause = function () {
        egret.stopTick(this.updata, this);
        this.tweenArr.forEach(function (item) {
            item.setPaused(true);
        });
        this.setChildIndex(this.mask1, this.numChildren - 1);
        this.mask1.visible = true;
        this.setChildIndex(this.gro_pause, this.numChildren - 1);
        this.gro_pause.visible = true;
        this.btn_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameContinue, this);
    };
    /**游戏继续 */
    GameScene.prototype.gameContinue = function () {
        this.btn_continue.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameContinue, this);
        egret.startTick(this.updata, this);
        this.tweenArr.forEach(function (item) {
            item.setPaused(false);
        });
        this.mask1.visible = false;
        this.gro_pause.visible = false;
    };
    /**重新开始 */
    GameScene.prototype.reStart = function () {
        console.log('重新开始');
        this.gro_over.visible = false;
        this.init();
    };
    return GameScene;
}(eui.Component));
__reflect(GameScene.prototype, "GameScene", ["eui.UIComponent", "egret.DisplayObject"]);
