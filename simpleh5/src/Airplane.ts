// TypeScript file
module fighter {
    export class Airplane extends egret.DisplayObjectContainer {
        private static cacheDict:Object = {};

        public static produce(textureName:string, fireDelay:number):fighter.Airplane {
            if (fighter.Airplane.cacheDict[textureName] == null) {
                fighter.Airplane.cacheDict[textureName] = [];
            }
            var dict:fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
            var theFighter:fighter.Airplane;
            if (dict.length > 0) {
                theFighter = dict.pop();
            } else {
                theFighter = new fighter.Airplane(RES.getRes(textureName), fireDelay);
            }
            theFighter.blood = 10;
            return theFighter;
        }

        public static reclaim(theFighter:fighter.Airplane, textureName: string):void {
            if (fighter.Airplane.cacheDict[textureName] == null) {
                fighter.Airplane.cacheDict[textureName] == [];
            }
            var dict:fighter.Airplane[] =  fighter.Airplane.cacheDict[textureName];
            if (dict.indexOf(theFighter) == -1) {
                dict.push(theFighter);
            }
        }

        private bmp:egret.Bitmap;
        private fireDelay:number;
        private fireTimer:egret.Timer;
        public blood:number = 10;

        public constructor(texture:egret.Texture, fireDelay:number) {
            super();
            this.fireDelay = fireDelay;
            this.bmp = new egret.Bitmap(texture);
            this.addChild(this.bmp);
            this.fireTimer = new egret.Timer(fireDelay);
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        }

        public fire():void {
            this.fireTimer.start();
        }
        public stopFire():void {
            this.fireTimer.stop();
        }
        private createBullet(evt:egret.TimerEvent):void {
            this.dispatchEventWith("createBullet");
        }
    }
}