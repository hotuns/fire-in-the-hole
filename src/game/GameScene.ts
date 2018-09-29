class GameScene extends eui.Component implements eui.UIComponent {
	public image: eui.Image;
	public gro_gameUI: eui.Group;
	public btn_pause: eui.Button;
	public pro_exp: eui.ProgressBar;
	public num_bomb: eui.Label;
	public num_LV: eui.Label;
	public num_hp: eui.Label;
	public num_score: eui.Label;
	public mask1: eui.Rect;
	public tip_ready: eui.Image;
	public tip_go: eui.Image;
	public gro_tip: eui.Group;
	public image0: eui.Image;
	public image1: eui.Image;
	public image3: eui.Image;
	public image2: eui.Image;
	public btn_closeTip: eui.Button;
	public gro_pause: eui.Group;
	public btn_goHome: eui.Button;
	public btn_continue: eui.Button;
	public tbtn_sound: eui.ToggleButton;
	public gro_over: eui.Group;
	public btn_goHome0: eui.Button;
	public tbtn_sound0: eui.ToggleButton;
	public btn_restart: eui.Button;
	public tip: egret.tween.TweenGroup
	public aimImg: egret.Bitmap
	public boomImg: egret.Bitmap
	public bomb: egret.Bitmap
	public num_end_top_score: eui.Label;
	public num_end_score: eui.Label;

	public tweenArr: egret.Tween[] = [] // 缓动动画组
	public enemysArr: Enemy[] = []
	// 滑动时候的坐标
	public pointEnd: egret.Point
	public pointBoom: egret.Point

	/**主角 */
	public myBear: MyBear
	/**得分 */
	public scoreText: number = 0
	/**游戏等级 */
	public gameLv: number

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		// 创建主角
		this.myBear = new MyBear()
		this.myBear.anchorOffsetX = this.myBear.width / 2
		this.myBear.anchorOffsetY = this.myBear.height / 2
		this.myBear.x = this.stage.stageWidth / 2
		this.myBear.y = 720

		// 创建准心位置图片
		this.aimImg = new egret.Bitmap()
		this.aimImg.texture = RES.getRes('GameScene-hd_json.GameScene_Mira')
		this.aimImg.anchorOffsetX = this.aimImg.width / 2
		this.aimImg.anchorOffsetY = this.aimImg.height / 2
		this.aimImg.alpha = 0.7

		// 创建爆炸图片
		this.boomImg = new egret.Bitmap()
		this.boomImg.texture = RES.getRes('GameScene-hd_json.GameScene_Explosion')
		this.boomImg.anchorOffsetX = this.boomImg.width / 2
		this.boomImg.anchorOffsetY = this.boomImg.height / 2

		// 提示 tip 动画
		this.tip.addEventListener('complete', this.onTweenGroupComplete, this);
		this.btn_closeTip.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			// 点击关闭后
			this.gro_tip.visible = false
			this.tip.stop()
			this.init()
		}, this)

		this.btn_pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gamePause, this)
		this.tip.play()

	}

	// 初始化
	private init() {

		// 显示准备开始
		egret.Tween.get(this.tip_ready).to({ alpha: 1 }).to({ alpha: 0 }, 500).call(() => {
			egret.Tween.get(this.tip_go).to({ alpha: 1 }).to({ alpha: 0 }, 500).call(() => {
				// 游戏开始
				this.mask1.visible = false
				this.scoreText = 0

				// 添加主角到舞台
				this.addChildAt(this.myBear, this.numChildren - 3)
				egret.startTick(this.updata, this)
			})
		})

		// 创建敌人
		this.createEnemy()

		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this)
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this)
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this)


	}

	/**创建敌人 */
	private createEnemy() {
		this.enemysArr.push(Enemy.produce({ x: 50, y: 0, type: 'normal' }))
		this.enemysArr.push(Enemy.produce({ x: 200, y: 0, type: 'normal' }))
		this.enemysArr.push(Enemy.produce({ x: 400, y: 0, type: 'normal' }))
		this.enemysArr.forEach((item) => {
			this.addChildAt(item, this.numChildren - 9)

		})
	}

	/**更新 */
	private updata(): boolean {
		this.num_hp.text = this.myBear.hp.toString()
		this.num_score.text = this.scoreText.toString()
		// 敌人移动
		if (this.enemysArr.length > 0) {
			for (let i = this.enemysArr.length - 1; i >= 0; i--) {
				let item = this.enemysArr[i]
				console.log(item, this.enemysArr.length);

				// 判断掉血
				if (item.y === 720) {
					// this.myBear.hp -= 1
					this.gameOver()
				}
				// 超出屏幕删除
				if (item.y >= this.stage.stageHeight) {
					console.log('超出屏幕');
					item.goDie()
					this.enemysArr.splice(i, 1)
					continue
				}
				item.move()
			}
		}


		return false
	}

	/**tween组完成,循环播放 */
	private onTweenGroupComplete(): void {
		this.tip.play(0)
	}

	private isMove: boolean
	/**滑动开始 */
	private touchBegin(e: egret.TouchEvent) {
		if (e.target === this.myBear) {
			this.isMove = true
			this.addChild(this.aimImg)
			this.pointEnd = new egret.Point(e.stageX, e.stageY)
			this.showAim()
		}

	}
	/**滑动过程 */
	private touchMove(e) {
		if (this.isMove) {
			this.pointEnd = new egret.Point(e.stageX, e.stageY)
			this.showAim()
		}
	}
	/**滑动结束 */
	private touchEnd(e) {
		if (this.isMove) {
			this.removeChild(this.aimImg)
			this.showBomb()
			this.isMove = false
		}
	}

	/**显示瞄准器 */
	private showAim() {
		this.pointBoom = new egret.Point()
		let x1 = this.myBear.x
		let y1 = this.myBear.y

		const k = (this.pointEnd.y - y1) / (this.pointEnd.x - x1)
		let jvli = (this.pointEnd.y - y1) * 3
		this.pointBoom.x = x1 - (jvli / k)
		this.pointBoom.y = y1 - jvli
		this.pointBoom.x = Math.max(this.pointBoom.x, 0 + (this.aimImg.width / 2))
		this.pointBoom.x = Math.min(this.pointBoom.x, this.stage.stageWidth - (this.aimImg.width / 2))
		this.pointBoom.y = Math.max(this.pointBoom.y, 0 + (this.aimImg.height / 2))
		this.pointBoom.y = Math.min(this.pointBoom.y, this.stage.stageHeight - (this.aimImg.height / 2))
		this.aimImg.x = this.pointBoom.x
		this.aimImg.y = this.pointBoom.y
	}

	/**显示炸弹 */
	private showBomb() {
		// 创建炸弹
		let bomb = new Bomb()
		bomb.x = this.myBear.x
		bomb.y = this.myBear.y - 10
		this.addChild(bomb)

		let a = Math.abs((bomb.x - this.pointBoom.x))
		let b = Math.abs((bomb.y - this.pointBoom.y))
		let c = Math.sqrt(a * a + b * b)
		let time = Math.abs(c * 3)


		let tw1 = egret.Tween.get(bomb).to({ scaleX: 0.5, scaleY: 0.5 }).to({ scaleX: 1.2, scaleY: 1.2 }, time / 2).to({ scaleX: 0.7, scaleY: 0.7 }, time / 2)
		let tw2 = egret.Tween.get(bomb).to({ x: this.pointBoom.x, y: this.pointBoom.y, rotation: 360 }, time).call(() => {
			egret.Tween.removeTweens(bomb)
			this.tweenArr.splice(this.tweenArr.indexOf(tw1), 1)
			this.tweenArr.splice(this.tweenArr.indexOf(tw2), 1)
			bomb.booming()
			let tw3 = egret.Tween.get(this)
				.to({ x: 20, y: 10 }, 30)
				.to({ x: -10, y: 0 }, 30)
				.to({ x: 0, y: -20 }, 30)
				.to({ x: -30, y: 40 }, 30)
				.to({ x: 40, y: 0 }, 30)
				.to({ x: 10, y: 30 }, 30)
				.to({ x: 10, y: 10 }, 30)
				.to({ x: 0, y: 0 }, 30).call(function () {
					egret.Tween.removeTweens(tw3)
				})
		})
		this.tweenArr.push(tw1)
		this.tweenArr.push(tw2)
	}

	/**游戏结束 */
	private gameOver() {
		egret.stopTick(this.updata, this)
		this.enemysArr.forEach((item) => {
			item.goDie()
		})
		this.mask1.visible = true
		this.gro_over.visible = true
		this.num_end_score.text = this.scoreText.toString()
		this.btn_restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reStart, this)

	}

	/**游戏暂停 */
	private gamePause() {
		egret.stopTick(this.updata, this)
		console.log(this.tweenArr);
		this.tweenArr.forEach((item: egret.Tween) => {
			item.setPaused(true)
		})

		this.mask1.visible = true
		this.gro_pause.visible = true

		this.btn_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameContinue, this)
	}

	/**游戏继续 */
	private gameContinue() {
		this.btn_continue.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameContinue, this)
		egret.startTick(this.updata, this)
		this.tweenArr.forEach((item: egret.Tween) => {
			item.setPaused(false)
		})
		this.mask1.visible = false
		this.gro_pause.visible = false
	}

	/**重新开始 */
	private reStart() {
		this.gro_over.visible = false

		this.init()
	}
}