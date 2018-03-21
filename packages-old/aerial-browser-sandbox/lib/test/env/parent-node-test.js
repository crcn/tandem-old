"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var chai_1 = require("chai");
describe(__filename + "#", function () {
    it("can append a new child", function () { return __awaiter(_this, void 0, void 0, function () {
        var window, child;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window = utils_1.openTestWindow(utils_1.wrapHTML());
                    return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                case 1:
                    _a.sent();
                    child = window.document.body.appendChild(window.document.createTextNode("a"));
                    chai_1.expect(child.parentElement).to.eql(window.document.body);
                    chai_1.expect(window.document.body.childNodes.length).to.eql(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("removes a child from a previous parent when appending", function () { return __awaiter(_this, void 0, void 0, function () {
        var window, h1, child, h2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window = utils_1.openTestWindow(utils_1.wrapHTML("<h1></h1><h2></h2>"));
                    return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                case 1:
                    _a.sent();
                    h1 = window.document.querySelector("h1");
                    child = h1.appendChild(window.document.createTextNode("a"));
                    chai_1.expect(h1.childNodes.length).to.eql(1);
                    h2 = window.document.querySelector("h2");
                    h2.appendChild(child);
                    chai_1.expect(h2.childNodes.length).to.eql(1);
                    chai_1.expect(h1.childNodes.length).to.eql(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can insert a child before an existing one", function () { return __awaiter(_this, void 0, void 0, function () {
        var window, body, a, b;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window = utils_1.openTestWindow(utils_1.wrapHTML());
                    return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                case 1:
                    _a.sent();
                    body = window.document.body;
                    a = body.appendChild(window.document.createTextNode("a"));
                    b = body.insertBefore(window.document.createTextNode("b"), a);
                    chai_1.expect(body.childNodes.length).to.eql(2);
                    chai_1.expect(body.childNodes[0]).to.eql(b);
                    chai_1.expect(body.childNodes[1]).to.eql(a);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can insert a document fragment before an existing child", function () { return __awaiter(_this, void 0, void 0, function () {
        var window, body, a, fragment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window = utils_1.openTestWindow(utils_1.wrapHTML());
                    return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                case 1:
                    _a.sent();
                    body = window.document.body;
                    a = body.appendChild(window.document.createTextNode("a"));
                    fragment = window.document.createDocumentFragment();
                    fragment.appendChild(window.document.createTextNode("b"));
                    fragment.appendChild(window.document.createTextNode("c"));
                    fragment.appendChild(window.document.createTextNode("d"));
                    body.insertBefore(fragment, a);
                    chai_1.expect(body.innerHTML).to.eql("bcda");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=parent-node-test.js.map