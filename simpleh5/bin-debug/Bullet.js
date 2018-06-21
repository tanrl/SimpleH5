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
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(texture, textureName) {
            var _this = _super.call(this, texture) || this;
            _this.textureName = textureName;
            return _this;
        }
        Bullet.produce = function (textureName) {
            if (fighter.Bullet.cacheDict[textureName] == null)
                fighter.Bullet.cacheDict[textureName] = [];
            var dict = fighter.Bullet.cacheDict[textureName];
            var bullet;
            if (dict.length > 0) {
                bullet = dict.pop();
            }
            else {
                bullet = new fighter.Bullet(RES.getRes(textureName), textureName);
            }
            return bullet;
        };
        Bullet.reclaim = function (bullet) {
            var textureName = bullet.textureName;
            if (fighter.Bullet.cacheDict[textureName] == null)
                fighter.Bullet.cacheDict[textureName] = [];
            var dict = fighter.Bullet.cacheDict[textureName];
            if (dict.indexOf(bullet) == -1) {
                dict.push(bullet);
            }
        };
        Bullet.cacheDict = {};
        return Bullet;
    }(egret.Bitmap));
    fighter.Bullet = Bullet;
    __reflect(Bullet.prototype, "fighter.Bullet");
})(fighter || (fighter = {}));
//# sourceMappingURL=Bullet.js.map