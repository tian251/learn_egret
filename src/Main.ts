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

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
    
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
      var bg:egret.Shape = new egret.Shape();
      bg.graphics.beginFill( 0x336699 );
      bg.graphics.drawRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight ); 
      bg.graphics.endFill();
     //   super.addChild( bg )
      this.addChild( bg )
      var tx:egret.TextField = new egret.TextField();
      tx.text = 'ma tian ci';
      tx.size=33;
      tx.x=20;
      tx.y=20;
      tx.width = this.stage.stageWidth-40;
      this.addChild( tx );
      tx.touchEnabled = true; 
    //   tx.addEventListener( egret.TouchEvent.TOUCH_TAP, this.touchHandler, this );4
    tx.addEventListener(egret.TouchEvent.TOUCH_TAP,function(evt:egret.TouchEvent){
        var tx:egret.TextField = evt.currentTarget;
        tx.textColor = 0X00ff00;

    },this)
    console.log( "createGameScene", RES.getRes("checkbox_select_disabled_png") );
    var batman:egret.Bitmap = new egret.Bitmap( RES.getRes("checkbox_select_disabled_png") );
    batman.x=180;
    batman.y=120;
    this.addChild( batman )
    var batma:egret.Bitmap = new egret.Bitmap( RES.getRes("checkbox_select_down_png") );
    batma.x=150;
    batma.y=120;
     // batman.anchorOffsetX=40;
    // batman.anchorOffsetY=40;
    // batma.x+=40;
    // batma.y+=40;
    this.addChild( batma )
    console.log( "display indexes:", this.getChildIndex( bg ), this.getChildIndex( batman ),  this.getChildIndex( batma ) );
    // 改变深度
    // this.setChildIndex( bg, this.getChildIndex( batma ) );
    // 交换深度
    // this.swapChildren( bg, batma );
    // 数值改变深度
    // this.setChildIndex( batman, 20 );
    console.log( "display indexes:", this.getChildIndex( bg ), this.getChildIndex( batman ),  this.getChildIndex( batma ) );
    
    this.times = -1;
   var self = this;
    this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, function(){ 
    switch ( ++ self.times % 3 ) { 
        case 0: egret.Tween.get( batman ).to( { x:batma.x }, 300, egret.Ease.circIn );   
                egret.Tween.get( batma ).to( { x:batman.x }, 300, egret.Ease.circIn );
        break; 
        case 1:  egret.Tween.get( batman ).to( { alpha:.3 }, 300, egret.Ease.circIn ).to( { alpha:1 }, 300, egret.Ease.circIn );
         break; 
        case 2:    egret.Tween.get( batman ).to( { scaleX:.4, scaleY:.4 }, 500, egret.Ease.circIn ).to( { scaleX:1, scaleY:1 }, 500, egret.Ease.circIn );
         break; 
    } 


}, this );
// 网络请求
    var request = new egret.HttpRequest();
    request.responseType = egret.HttpResponseType.TEXT;
    request.open("http://httpbin.org/get",egret.HttpMethod.GET);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send();
    request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
    request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
    request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);

   
    
    }
    private times:number;
    private onGetComplete(event:egret.Event):void {
    var request = <egret.HttpRequest>event.currentTarget;
    console.log("get data : ",request.response);
    var responseLabel = new egret.TextField();
    responseLabel.size = 18;
    // responseLabel.text = "GET response: \n" + request.response.substring(0, 50) + "...";
    this.addChild(responseLabel);
    responseLabel.x = 50;
    responseLabel.y = 70;
}

private onGetIOError(event:egret.IOErrorEvent):void {
    console.log("get error : " + event);
}

private onGetProgress(event:egret.ProgressEvent):void {
    console.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
}
// webstore请求

    // protected touchHandler(evt:egret.TouchEvent){
    //       var tx:egret.TextField = evt.currentTarget;
    //       tx.textColor = 0x00ff00; 
    // }
    
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    
 
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */


    /**
     * 点击按钮
     * Click the button
     */
   
}
