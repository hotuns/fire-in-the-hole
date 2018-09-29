class Door extends eui.Component implements eui.UIComponent {
	public gro_left: eui.Group;
	public gro_right: eui.Group;
	public bz: eui.Image;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);

	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	private onAddToStage() {
		this.toggle()
	}
	public toggle() {
		let tw_left = egret.Tween.get(this.gro_left)
		tw_left.to({ x: 0 }, 500, egret.Ease.quadIn).to({ x: -640 }, 1000, egret.Ease.quadIn)

		let tw_right = egret.Tween.get(this.gro_right)
		tw_right.to({ x: 320 }, 500, egret.Ease.quadIn).to({ x: 960 }, 1000, egret.Ease.quadIn).call(() => {
			SceneManager.removeScene(this)
		})
	}

}