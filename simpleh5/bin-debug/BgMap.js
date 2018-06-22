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
    var BgMap = (function (_super) {
        __extends(BgMap, _super);
        function BgMap() {
            var _this = _super.call(this) || this;
            _this.speed = 2;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        BgMap.prototype.onAddToStage = function (event) {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var texture = RES.getRes("bg_jpg");
            this.textureHeight = texture.textureHeight;
            this.rowCount = Math.ceil(this.stageH / this.textureHeight) + 1;
            this.bmpArr = [];
            for (var i = 0; i < this.rowCount; i++) {
                var bgBmp = fighter.createBitmapByName("bg_jpg");
                bgBmp.width = this.stageW;
                bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
                this.bmpArr.push(bgBmp);
                this.addChild(bgBmp);
            }
        };
        BgMap.prototype.start = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFramehandler, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFramehandler, this);
        };
        BgMap.prototype.enterFramehandler = function (event) {
            for (var i = 0; i < this.rowCount; i++) {
                var bgBmp = this.bmpArr[i];
                bgBmp.y += this.speed;
                if (bgBmp.y > this.stageH) {
                    bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bgBmp);
                }
            }
        };
        BgMap.prototype.pause = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFramehandler, this);
        };
        return BgMap;
    }(egret.DisplayObjectContainer));
    fighter.BgMap = BgMap;
    __reflect(BgMap.prototype, "fighter.BgMap");
})(fighter || (fighter = {}));
//# sourceMappingURL=BgMap.js.map