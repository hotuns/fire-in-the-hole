class MyBear extends egret.Bitmap {
	public hp: number //血量
	public constructor() {
		super()
		this.texture = RES.getRes('GameScene-hd_json.Enemies_Fast')
		this.hp = 5
		this.touchEnabled = true
	}

	private init() {
		// this.addEventListener(egret.TouchEvent.TOUCH_TAP)
	}
}