"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Scanner = /** @class */ (function () {
    function Scanner(_target) {
        this._target = _target;
        this.pos = 0;
        this.length = _target.length;
    }
    Scanner.prototype.curr = function () {
        return this._target[this.pos];
    };
    Scanner.prototype.shift = function () {
        var char = this._target[this.pos];
        this.next();
        return char;
    };
    Scanner.prototype.hasNext = function () {
        return this.pos < this.length - 1;
    };
    Scanner.prototype.next = function () {
        return this._target[Math.min(this.pos = this.pos + 1, this.length)];
    };
    Scanner.prototype.prev = function () {
        return this._target[Math.max(this.pos = this.pos - 1, 0)];
    };
    Scanner.prototype.ended = function () {
        return this.pos >= this.length;
    };
    return Scanner;
}());
exports.Scanner = Scanner;
var StringScanner = /** @class */ (function (_super) {
    __extends(StringScanner, _super);
    function StringScanner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringScanner.prototype.scan = function (until) {
        var buffer = "";
        while (this.pos < this.length) {
            var cchar = this._target[this.pos];
            if (!cchar.match(until))
                break;
            buffer += cchar;
            this.pos++;
        }
        return buffer;
    };
    StringScanner.prototype.match = function (regex) {
        var buffer = "";
        var start = this._target.substr(this.pos);
        var result = start.match(regex);
        if (result) {
            var content = result[0];
            this.pos += start.indexOf(content) + content.length;
            return content;
        }
        return null;
    };
    StringScanner.prototype.peek = function (length) {
        return this._target.substr(this.pos, length);
    };
    StringScanner.prototype.take = function (length) {
        var buffer = this._target.substr(this.pos, length);
        this.pos += length;
        return buffer;
    };
    return StringScanner;
}(Scanner));
exports.StringScanner = StringScanner;
var TokenScanner = /** @class */ (function (_super) {
    __extends(TokenScanner, _super);
    function TokenScanner(source, tokens) {
        var _this = _super.call(this, tokens) || this;
        _this.source = source;
        return _this;
    }
    TokenScanner.prototype.peek = function (count) {
        if (count === void 0) { count = 1; }
        return this._target[this.pos + count];
    };
    TokenScanner.prototype.peekUntil = function (until) {
        var i = this.pos;
        while (i < this.length - 1) {
            if (until(this._target[++i])) {
                return this._target[i];
            }
        }
    };
    TokenScanner.prototype.curr = function () {
        return _super.prototype.curr.call(this);
    };
    TokenScanner.prototype.next = function () {
        return _super.prototype.next.call(this);
    };
    return TokenScanner;
}(Scanner));
exports.TokenScanner = TokenScanner;
exports.eatUntil = function (scanner, type) {
    while (!scanner.ended()) {
        var curr = scanner.curr();
        if (curr.type !== type) {
            break;
        }
        scanner.next();
    }
    return !scanner.ended();
};
//# sourceMappingURL=scanners.js.map