"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = require("puppeteer");
var fs = require("fs");
var path = require("path");
var fsa = require("fs-extra");
var effects_1 = require("redux-saga/effects");
var constants_1 = require("../constants");
var actions_1 = require("../actions");
var utils_1 = require("../utils");
var SCREENSHOT_DELAY = 1000;
function screenshotsSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.spawn(handleTakingScreesnshots)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNewScreenshot)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSavedScreenshot)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(cleanupOldScreenshots)];
            case 4:
                _a.sent();
                // last thing to launch
                return [4 /*yield*/, effects_1.fork(openHeadlessBrowser)];
            case 5:
                // last thing to launch
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.screenshotsSaga = screenshotsSaga;
var MAX_SCREENSHOTS = 10;
function openHeadlessBrowser() {
    var browser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.take(actions_1.INIT_SERVER_REQUESTED)];
            case 1:
                _a.sent();
                console.log("Opening headless chrome browser");
                return [4 /*yield*/, effects_1.call(puppeteer_1.launch)];
            case 2:
                browser = _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.headlessBrowserLaunched(browser))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function takeAssocScreenshots(filePath) {
    var state, assocComponents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                return [4 /*yield*/, effects_1.call(utils_1.getAssocComponents, filePath, state)];
            case 2:
                assocComponents = _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleTakingScreesnshots() {
    var state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.take(actions_1.HEADLESS_BROWSER_LAUNCHED)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.call(takeComponentScreenshot)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 4:
                state = _a.sent();
                if (!!state.shouldTakeAnotherScreenshot) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take([actions_1.FILE_CONTENT_CHANGED, actions_1.FILE_REMOVED])];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}
var getAllComponentsPreviewSize = function (entries) { return ({
    width: entries.reduce(function (a, b) { return Math.max(a, b.bounds.right); }, 0),
    height: entries.reduce(function (a, b) { return Math.max(a, b.bounds.bottom); }, 0)
}); };
function takeComponentScreenshot() {
    var state, entries, clippings, _i, entries_1, entry, previewUrl, browser, page, buffer, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.componentScreenshotStarted())];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 10, , 11]);
                entries = utils_1.getPreviewComponentEntries(state);
                console.log("Taking screenshot of " + entries.length + " components...");
                clippings = {};
                for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    entry = entries_1[_i];
                    clippings[utils_1.getPreviewClippingNamespace(entry.componentId, entry.previewName)] = entry.bounds;
                }
                previewUrl = utils_1.getAllComponentsPreviewUrl(state);
                browser = state.headlessBrowser;
                return [4 /*yield*/, effects_1.call(browser.newPage.bind(browser))];
            case 4:
                page = _a.sent();
                return [4 /*yield*/, effects_1.call(page.goto.bind(page), previewUrl)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.call(page.setViewport.bind(page), getAllComponentsPreviewSize(entries))];
            case 6:
                _a.sent();
                // wait for a bit for all resources to load
                return [4 /*yield*/, effects_1.call(page.waitForSelector.bind(page), ".__ready")];
            case 7:
                // wait for a bit for all resources to load
                _a.sent();
                return [4 /*yield*/, effects_1.call(page.screenshot.bind(page, { type: "png" }))];
            case 8:
                buffer = _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.componentScreenshotTaken(buffer, clippings, "image/png"))];
            case 9:
                _a.sent();
                page.close();
                return [3 /*break*/, 11];
            case 10:
                e_1 = _a.sent();
                console.error(e_1.stack);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}
function handleNewScreenshot() {
    var _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_1 = function () {
                    var _a, contentType, buffer, clippings, filePath, e_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.COMPONENT_SCREENSHOT_TAKEN)];
                            case 1:
                                _a = _b.sent(), contentType = _a.contentType, buffer = _a.buffer, clippings = _a.clippings;
                                // for now -- use mime type look up eventually
                                if (contentType !== "image/png") {
                                    throw new Error("Unsupported image type " + contentType + ".");
                                }
                                filePath = path.join(constants_1.SCREENSHOTS_DIRECTORY, Date.now() + ".png");
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, effects_1.call(function () { return new Promise(function (resolve, reject) {
                                        fs.writeFile(filePath, buffer, function (err) {
                                            if (err)
                                                return reject(err);
                                            resolve();
                                        });
                                    }); })];
                            case 3:
                                _b.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _b.sent();
                                // shouldn't happen, but if it does...
                                console.error("Unable to save screenshot: ", e_2);
                                return [2 /*return*/, "continue"];
                            case 5:
                                console.log("Saved components screenshot " + filePath);
                                return [4 /*yield*/, effects_1.put(actions_1.componentScreenshotSaved(filePath, clippings))];
                            case 6:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleSavedScreenshot() {
    var state, screenshots, delta, i, uri, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.COMPONENT_SCREENSHOT_SAVED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                screenshots = state.componentScreenshots.slice();
                if (!(screenshots.length > MAX_SCREENSHOTS)) return [3 /*break*/, 8];
                delta = screenshots.length - MAX_SCREENSHOTS;
                // Just in case, show a warning.
                if (delta > 1) {
                    console.warn("delta for MAX_SCREENSHOTS exceeds 2. There's probably a bug somewhere else in the app.");
                }
                i = delta;
                _a.label = 3;
            case 3:
                if (!i--) return [3 /*break*/, 8];
                uri = screenshots.shift().uri;
                console.log("Removing old screenshot " + uri);
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                fsa.unlinkSync(uri);
                return [4 /*yield*/, effects_1.put(actions_1.componentScreenshotRemoved(uri))];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                e_3 = _a.sent();
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 3];
            case 8: return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
function cleanupOldScreenshots() {
    return __generator(this, function (_a) {
        console.log("Cleaning up screenshots directory");
        try {
            fsa.emptyDirSync(constants_1.SCREENSHOTS_DIRECTORY);
            fsa.rmdirSync(constants_1.SCREENSHOTS_DIRECTORY);
        }
        catch (e) {
            console.warn("Cannot cleaup directory " + constants_1.SCREENSHOTS_DIRECTORY + ": ", e);
        }
        fsa.mkdirpSync(constants_1.SCREENSHOTS_DIRECTORY);
        return [2 /*return*/];
    });
}
//# sourceMappingURL=screenshots.js.map