var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
// TypeScript file
var fighter;
(function (fighter) {
    var Airplane = (function (_super) {
        __extends(Airplane, _super);
        function Airplane(texture, fireDelay) {
            var _this = _super.call(this) || this;
            _this.blood = 10;
            _this.fireDelay = fireDelay;
            _this.bmp = new egret.Bitmap(texture);
            _this.addChild(_this.bmp);
            _this.fireTimer = new egret.Timer(fireDelay);
            _this.fireTimer.addEventListener(egret.TimerEvent.TIMER, _this.createBullet, _this);
            return _this;
        }
        Airplane.produce = function (textureName, fireDelay) {
            if (fighter.Airplane.cacheDict[textureName] == null)
                fighter.Airplane.cacheDict[textureName] = [];
            var dict = fighter.Airplane.cacheDict[textureName];
            var theFighter;
            if (dict.length > 0) {
                theFighter = dict.pop();
            }
            else {
                theFighter = new fighter.Airplane(RES.getRes(textureName), fireDelay);
            }
            theFighter.blood = 10;
            return theFighter;
        };
        Airplane.reclaim = function (theFighter, textureName) {
            if (fighter.Airplane.cacheDict[textureName] == null) {
                fighter.Airplane.cacheDict[textureName] == [];
            }
            var dict = fighter.Airplane.cacheDict[textureName];
            if (dict.indexOf(theFighter) == -1) {
                dict.push(theFighter);
            }
        };
        Airplane.prototype.fire = function () {
            this.fireTimer.start();
        };
        Airplane.prototype.stopFire = function () {
            this.fireTimer.stop();
        };
        Airplane.prototype.createBullet = function (evt) {
            this.dispatchEventWith("createBullet");
        };
        return Airplane;
    }(egret.DisplayObjectContainer));
    fighter.Airplane = Airplane;
    __reflect(Airplane.prototype, "fighter.Airplane");
})(fighter || (fighter = {}));
//# sourceMappingURL=Airplane.js.map