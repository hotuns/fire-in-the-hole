//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {
    // eui 进度条组件
    private barSkin = `<?xml version="1.0" encoding="utf-8"?>
<e:Skin class="proBar" width="484" height="36" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
    <e:Image source="LoadingScene-hd_json.LoadingScene_LoadingBar" x="0" y="0" />
    <e:Image id="thumb" source="LoadingScene-hd_json.LoadingScene_GreenBar" x="10" y="0" />
</e:Skin>`
    private proBar: eui.ProgressBar
    private cir: egret.Bitmap
    private bear: egret.Bitmap
    private timer: egret.Timer
    private leftGroup: eui.Group
    private rightGroup: eui.Group

    public constructor() {
        super();
        this.proBar = new eui.ProgressBar()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
        this.addEventListener(egret.Event.ENTER_FRAME, this.updata, this)
        this.timer = new egret.Timer(700, 0)
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.wink, this)
    }

    private init(): void {
        this.leftGroup = new eui.Group
        this.rightGroup = new eui.Group
        this.timer.start()

        // 背景
        let stageW = this.stage.stageWidth
        let stageH = this.stage.stageHeight
        let loadingbg = new eui.Image()
        loadingbg.texture = RES.getRes('Piso-hd_png')
        this.addChild(loadingbg)

        // 进度条
        this.proBar.skinName = this.barSkin
        this.proBar.x = (stageW - this.proBar.width) / 2
        this.proBar.y = (stageH - this.proBar.height) / 2 + 50
        this.addChild(this.proBar)

        // 转圈圈
        this.cir = new egret.Bitmap()
        this.cir.texture = RES.getRes('CirculoCarga-hd_png')
        this.cir.x = stageW / 2
        this.cir.y = stageH / 2 + 200
        this.cir.anchorOffsetX = this.cir.width / 2
        this.cir.anchorOffsetY = this.cir.height / 2
        this.addChild(this.cir)

        // 熊 logo 标题
        let Logo_Zombies = new egret.Bitmap()
        Logo_Zombies.texture = RES.getRes('Logo-hd_json.Logo_Zombies')
        Logo_Zombies.x = 67
        Logo_Zombies.y = 290
        let Logo_Teddy = new egret.Bitmap()
        Logo_Teddy.texture = RES.getRes('Logo-hd_json.Logo_Teddy')
        Logo_Teddy.x = 67
        Logo_Teddy.y = 185
        this.bear = new egret.Bitmap()
        this.bear.texture = RES.getRes('Logo-hd_json.Logo_Cabeza1')
        this.bear.x = 422
        this.bear.y = 173
        this.addChild(Logo_Teddy)
        this.addChild(Logo_Zombies)
        this.addChild(this.bear)
    }

    private wink() {
        this.bear.texture = RES.getRes('Logo-hd_json.Logo_Cabeza2')
        setTimeout(() => {
            this.bear.texture = RES.getRes('Logo-hd_json.Logo_Cabeza1')
        }, 100);
    }

    private updata() {
        this.cir.rotation += 10
    }

    public onProgress(current: number, total: number): void {
        this.proBar.value = current / total * 100
        if (current / total === 1) {
            console.log('load done')
        }
    }
}
