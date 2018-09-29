enum enemyType {

}
class Enemy extends eui.Image {
	// 保存敌人对象的对象池
	static _pool: Object = {}
	/**生产 */
	static produce(obj): Enemy {
		if (Enemy._pool[obj.type] == null) {
			Enemy._pool[obj.type] == []
		}
		let theArr: Enemy[] = Enemy._pool[obj.type]
		let theEnemy: Enemy
		if (theArr.length > 0) {
			theEnemy = theArr.pop()
			console.log('从对象池中取出');

		} else {
			theEnemy = new Enemy(obj)
		}

		return theEnemy
	}

	/**回收 */
	static reclaim(theEnemy: Enemy) {
		if (Enemy._pool[theEnemy.type] = null) {
			Enemy._pool[theEnemy.type] = []
		}
		let theArr: Enemy[] = Enemy._pool[theEnemy.type]
		if (theArr.indexOf(theEnemy) == -1) {
			theArr.push(theEnemy)
			console.log('存进对象池');

		}
	}


	public type: string  //类型
	public hp: number	//血量
	public secondsToGoal: number	//
	public damage: number	//伤害
	public exp: number	//经验
	public score: number	//得分
	public dodgeChance	//闪避概率
	public constructor(obj) {
		super()
		this.x = obj.x
		this.y = obj.y
		this.type = obj.type
		this.hp = obj.hp || 0
		this.secondsToGoal = obj.secondsToGoal || 0
		this.damage = obj.damage || 1
		this.exp = obj.exp || 0
		this.score = obj.score || 0
		this.dodgeChance = obj.dodgeChance || 0
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
	}

	private onAddToStage() {
		this.source = RES.getRes('GameScene-hd_json.Enemies_Zombie')
	}

	public move() {
		this.y += 1
	}

	/** 死亡*/
	public goDie() {
		if (this.parent) {
			Enemy.reclaim(this)
			this.parent.removeChild(this)
		}
	}
}