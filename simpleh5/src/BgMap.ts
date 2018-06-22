// TypeScript file
module fighter {
    export class BgMap extends egret.DisplayObjectContainer {
        private bmpArr:egret.Bitmap[];
        private rowCount:number;
        private stageW:number;
        private stageH:number;
        private textureHeight:number;
        private speed:number = 2;

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        private onAddToStage(event:egret.Event) {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var texture:egret.Texture = RES.getRes("bg_jpg");
            this.textureHeight = texture.textureHeight;
            this.rowCount = Math.ceil(this.stageH/this.textureHeight)+1;
            this.bmpArr = [];

            for (var i:number = 0; i < this.rowCount; i++) {
                var bgBmp:egret.Bitmap = fighter.createBitmapByName("bg_jpg");
                bgBmp.width = this.stageW;
                bgBmp.y = this.textureHeight*i-(this.textureHeight*this.rowCount-this.stageH);
                this.bmpArr.push(bgBmp);
                this.addChild(bgBmp);
            }
        }

        public start():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFramehandler, this);            
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFramehandler, this);
        }
        private enterFramehandler(event:egret.Event):void {
            for (var i:number=0; i < this.rowCount; i++)  
            {
                var bgBmp:egret.Bitmap = this.bmpArr[i];
                bgBmp.y += this.speed;
                if (bgBmp.y > this.stageH) {
                    bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bgBmp);
                }
            }
        }
        public pause():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFramehandler, this);
        }
    }
}