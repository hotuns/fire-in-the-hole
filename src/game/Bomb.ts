// enum craters {
// 	'GameScene-hd_json.GameScene_MarcaPiso1', 'GameScene-hd_json.GameScene_MarcaPiso2', 'GameScene-hd_json.GameScene_MarcaPisoCritical',
// }
class Bomb extends eui.Image {

	public constructor() {
		super()
		this.source = RES.getRes('GameScene-hd_json.GameScene_Granada')
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
	}
	private init() {
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
	}
	/**爆炸 */
	public booming() {
		this.isHit()
		this.source = RES.getRes('GameScene-hd_json.GameScene_Explosion')
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		let tw = egret.Tween.get(this)
		tw.to({ scaleX: 1.5, scaleY: 1.5, alpha: 0.5 }, 200).call(() => {
			this.finish()
		})
	}
	/**爆炸完成 */
	private finish() {
		let randownNum = Math.floor(Math.random()) * 3 + 1
		this.source = RES.getRes(`GameScene-hd_json.GameScene_MarcaPiso${randownNum}`)
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		setTimeout(() => {
			this.parent.removeChild(this)
		}, 700)
	}
	/**是否击中 */
	public isHit() {

		for (let i = SceneManager.instance.gamescene.enemysArr.length - 1; i >= 0; i--) {
			let theEnemy = SceneManager.instance.gamescene.enemysArr[i]
			if (SceneManager.hitTest(theEnemy, this)) {
				console.log(theEnemy.hp);

				theEnemy.hp -= 1
			}
		}
	}
}	