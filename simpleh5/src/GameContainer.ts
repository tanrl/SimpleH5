// TypeScript file
module fighter {
    export class GameContainer extends egret.DisplayObjectContainer {
        private stageW:number;
        private stageH:number;
        private btnStart:egret.Bitmap;
        private bg:fighter.BgMap;
        private myFighter:fighter.Airplane;
        private myBullets:fighter.Bullet[] = [];
        private enemyFighters:fighter.Airplane[] = [];
        private enemyFightersTimer:egret.Timer = new egret.Timer(1000);
        private enemyBullets:fighter.Bullet[] = [];
        private scorePanel:fighter.ScorePanel;
        private myScore:number = 0;
        private _lastTime:number;

        public constructor() {
            super();
            this._lastTime = egret.getTimer();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        private onAddToStage(event:egret.Event):void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        }
        private createGameScene():void {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;

            this.bg = new fighter.BgMap();
            this.addChild(this.bg);
            this.btnStart = fighter.createBitmapByName("btn_start_png");
            this.btnStart.x = (this.stageW-this.btnStart.width)/2;
            this.btnStart.y = (this.stageH-this.btnStart.height)/2;
            this.btnStart.touchEnabled = true;
            this.myFighter = fighter.Airplane.produce("f1_png", 100);
            this.myFighter.y = this.stageH-this.myFighter.height-50;
            this.addChild(this.myFighter);
            this.scorePanel = new fighter.ScorePanel();
            this.preCreatedInstance();
        }
        private preCreatedInstance():void {
            var i:number = 0;
            var objArr:any[] = [];
            for (i = 0; i < 20; i++) {
                var bullet = fighter.Bullet.produce("b1_png");
                objArr.push(bullet);
            }
            for (i = 0; i < 20; i++) {
                var bullet:fighter.Bullet = objArr.pop();
                fighter.Bullet.reclaim(bullet);
            }
            for (i = 0; i < 20; i++) {
                var bullet = fighter.Bullet.produce("b2_png");
                objArr.push(bullet);
            }
            for (i = 0; i < 20; i++) {
                var bullet:fighter.Bullet = objArr.pop();
                fighter.Bullet.reclaim(bullet);
            }
            for (i = 0; i < 10; i++) {
                var enemyFghther:fighter.Airplane = fighter.Airplane.produce("f2_png", 1000);
                objArr.push(enemyFghther);
            }
            for (i = 0; i < 10; i++) {
                var enemyFighter = objArr.pop();
                fighter.Airplane.reclaim(enemyFighter, "f2_png");
            }

        }
        private gameStart():void {
            this.myScore = 0;
            this.removeChild(this.btnStart);
            this.bg.start();
            this.touchEnabled = true;
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.myFighter.x = (this.stageW-this.myFighter.width)/2;
            this.myFighter.fire();
            this.myFighter.blood = 10;
            this.myFighter.addEventListener("createBullet", this.createBulletHandler, this);
            this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
            this.enemyFightersTimer.start();
            if (this.scorePanel.parent == this) {
                this.removeChild(this.scorePanel);
            }
        }

        private createBulletHandler(evt:egret.Event):void {
            var bullet:fighter.Bullet;
            if (evt.target == this.myFighter) {
                for (var i:number = 0; i < 2; i++) {
                    bullet = fighter.Bullet.produce("b1_png");
                    bullet.x = i == 0?(this.myFighter.x+10):(this.myFighter.x + this.myFighter.width - 22);
                    bullet.y = this.myFighter.y + 30;
                    this.addChildAt(bullet, this.numChildren-1-this.enemyFighters.length);
                    this.myBullets.push(bullet);
                }
            } else {
                var theFighter:fighter.Airplane = evt.target;
                bullet = fighter.Bullet.produce("b2_png");
                bullet.x = theFighter.x + 28;
                bullet.y = theFighter.y + 10;
                this.addChildAt(bullet, this.numChildren-1-this.enemyFighters.length);
                this.enemyBullets.push(bullet);
            }
        }

        private createEnemyFighter(evt:egret.TimerEvent):void {
            var enemyFighter:fighter.Airplane = fighter.Airplane.produce("f2_png", 1000);
            enemyFighter.x = Math.random()*(this.stageW-enemyFighter.width);
            enemyFighter.y = -enemyFighter.height-Math.random()*300;
            enemyFighter.addEventListener("createBullet", this.createBulletHandler, this);
            enemyFighter.fire();
            this.addChildAt(enemyFighter, this.numChildren-1);
            this.enemyFighters.push(enemyFighter);
        }

        private gameViewUpdate(evt:egret.Event):void {
            var nowTime:number = egret.getTimer();
            var fps:number = 1000/(nowTime -this._lastTime);
            this._lastTime = nowTime;
            var speedOffset:number = 60/fps;
            var i:number = 0;
            var bullet:fighter.Bullet;
            var myBulletsCount:number = this.myBullets.length;
            for (; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                if (bullet.y < -bullet.height) {
                    this.removeChild(bullet);
                    Bullet.reclaim(bullet);
                    this.myBullets.splice(i, 1);
                    i--;
                    myBulletsCount--;
                }
                bullet.y -= 12 *  speedOffset;
            }

            var theFighter:fighter.Airplane;
            var enemyFighterCount:number = this.enemyFighters.length;
            for (i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyFighters[i];
                if (theFighter.y > this.stage.stageHeight) {
                    this.removeChild(theFighter);
                    Airplane.reclaim(theFighter, "f2_png");
                    theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
                    theFighter.stopFire();
                    this.enemyFighters.splice(i, 1);
                    i--;
                    enemyFighterCount--;
                }   
                theFighter.y += 4 * speedOffset;
            }

            var enemyBulletsCount:number = this.enemyBullets.length;
            for (i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (bullet.y > this.stage.stageHeight) {
                    this.removeChild(bullet);
                    Bullet.reclaim(bullet);
                    this.enemyBullets.splice(i, 1);
                    i--;
                    enemyBulletsCount--;
                }
                bullet.y += 8*speedOffset;
            }
            this.gameHitTest();
        }

        private gameHitTest():void {
            var i:number, j:number;
            var bullet:fighter.Bullet;
            var theFighter:fighter.Airplane;
            var myBulletsCount:number = this.myBullets.length;
            var enemyFighterCount:number = this.enemyFighters.length;
            var enemyBulletsCount:number = this.enemyBullets.length;

            var delBullets:fighter.Bullet[] = [];
            var delFighters:fighter.Airplane[] = [];
            
            for (i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                for (j = 0; j < enemyFighterCount; j++) {
                    theFighter = this.enemyFighters[j];
                    if (fighter.GameUtil.hitTest(theFighter, bullet)) {
                        theFighter.blood -= 2;
                        if (delBullets.indexOf(bullet) == -1) {
                            delBullets.push(bullet);
                        }
                        if (theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1)
                            delFighters.push(theFighter);
                    }
                }
            }
            for (i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (fighter.GameUtil.hitTest(this.myFighter, bullet)) {
                    this.myFighter.blood -= 1;
                    if (delBullets.indexOf(bullet) == -1)
                        delBullets.push(bullet);
                }
            }
            for (i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyFighters[i];
                if (fighter.GameUtil.hitTest(this.myFighter, theFighter))
                    this.myFighter.blood -= 10;
            }
            if (this.myFighter.blood <= 0) {
                this.gameStop();
            } else  {
                while (delBullets.length > 0) {
                    bullet = delBullets.pop();
                    this.removeChild(bullet);
                    if (bullet.textureName == "b1_png")
                        this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
                    else 
                        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
                    fighter.Bullet.reclaim(bullet);
                }
                this.myScore += delFighters.length;
                while(delFighters.length > 0) {
                    theFighter = delFighters.pop();
                    theFighter.stopFire();
                    theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
                    this.removeChild(theFighter);
                    this.enemyFighters.splice(this.enemyFighters.indexOf(theFighter), 1);
                    fighter.Airplane.reclaim(theFighter, "f2_png");
                }
            }

        }
        private gameStop():void {
            this.addChild(this.btnStart);
            this.bg.pause();
           
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.myFighter.stopFire();
            this.myFighter.removeEventListener("createBullet", this.createBulletHandler, this);
            this.enemyFightersTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
            this.enemyFightersTimer.stop();
            
            var i:number= 0;
            var bullet:fighter.Bullet;
            while (this.myBullets.length > 0) {
                bullet = this.myBullets.pop();
                this.removeChild(bullet);
                fighter.Bullet.reclaim(bullet);
            }
            while (this.enemyBullets.length > 0) {
                bullet = this.enemyBullets.pop();
                this.removeChild(bullet);
                fighter.Bullet.reclaim(bullet);
            }
            var theFighter:fighter.Airplane;
            while (this.enemyFighters.length > 0) {
                theFighter = this.enemyFighters.pop();
                theFighter.stopFire();
                theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
                this.removeChild(theFighter);
                fighter.Airplane.reclaim(theFighter, "f2_png");
            }
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = (this.stageW-this.scorePanel.width)/2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);
        }
        private touchHandler(evt:egret.TouchEvent):void {
            if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
                var tx:number = evt.localX;
                tx = Math.max(0,tx);
                tx = Math.min(this.stageW - this.myFighter.width, tx);
                this.myFighter.x = tx;
            }
        }
    }
}