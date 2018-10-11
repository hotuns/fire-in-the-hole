enum enemyTypes {
	'Zombie', 'Tank', 'Fast', 'Metal', 'Baseball', 'Skate'
}
class Enemy extends eui.Image {
	// 保存敌人对象的对象池
	static _pool: Object = {}
	/**生产 */
	static produce(obj): Enemy {
		if (Enemy._pool[obj.type] == null) {
			Enemy._pool[obj.type] = []
		}
		let theArr: Enemy[] = Enemy._pool[obj.type]
		let theEnemy: Enemy
		if (theArr.length > 0) {
			theEnemy = theArr.pop()
			theEnemy.x = obj.x
			theEnemy.y = obj.y
			theEnemy.type = obj.type
			theEnemy.hp = obj.hp || 2
			theEnemy.damage = obj.damage || 1
			theEnemy.exp = obj.exp || 0
			theEnemy.score = obj.score || 0

			console.log('从对象池中取出');

		} else {
			theEnemy = new Enemy(obj)
		}

		return theEnemy
	}

	/**回收 */
	static reclaim(theEnemy: Enemy) {
		if (Enemy._pool[theEnemy.type] == null) {
			Enemy._pool[theEnemy.type] = []
			console.log(Enemy._pool[theEnemy.type]);

		}
		let theArr: Enemy[] = Enemy._pool[theEnemy.type]

		if (theArr.indexOf(theEnemy) == -1) {
			theArr.push(theEnemy)
			console.log('存进对象池');
		}
	}


	public type: number  //类型
	public hp: number	//血量
	// public secondsToGoal: number	//
	public damage: number	//伤害
	public exp: number	//经验
	public score: number	//得分
	// public dodgeChance	//闪避概率
	public constructor(obj) {
		super()
		this.x = obj.x
		this.y = obj.y
		this.type = obj.type
		this.hp = obj.hp || 2
		this.damage = obj.damage || 1
		this.exp = obj.exp || 0
		this.score = obj.score || 0

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
	}

	private onAddToStage() {
		// 区别一下敌人血量
		this.hp = this.type == 0 || this.type == 2 || this.type == 4 ? 1 : 2
		this.source = RES.getRes(`GameScene-hd_json.Enemies_${enemyTypes[this.type]}`)
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