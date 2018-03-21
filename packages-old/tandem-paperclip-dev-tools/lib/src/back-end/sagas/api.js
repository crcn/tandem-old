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
var effects_1 = require("redux-saga/effects");
var lodash_1 = require("lodash");
var redux_saga_1 = require("redux-saga");
var sharp = require("sharp");
var request = require("request");
var md5 = require("md5");
var paperclip_1 = require("paperclip");
var slim_dom_1 = require("slim-dom");
var state_1 = require("../state");
var paperclip_2 = require("paperclip");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var actions_1 = require("../actions");
var express = require("express");
var path = require("path");
var fs = require("fs");
var source_mutation_1 = require("source-mutation");
var aerial_common2_1 = require("aerial-common2");
var constants_2 = require("../constants");
function routesSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleExpressServerStarted)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.routesSaga = routesSaga;
function handleExpressServerStarted() {
    var server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.EXPRESS_SERVER_STARTED)];
            case 1:
                server = (_a.sent()).server;
                return [4 /*yield*/, addRoutes(server)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function addRoutes(server) {
    var state, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41;
    return __generator(this, function (_42) {
        switch (_42.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _42.sent();
                _b = (_a = server).use;
                _c = [constants_2.PUBLIC_SRC_DIR_PATH];
                return [4 /*yield*/, wrapRoute(getFile)];
            case 2:
                _b.apply(_a, _c.concat([_42.sent()]));
                server.use(express.static(path.join(path.dirname(require.resolve("paperclip")), "dist")));
                console.log("serving paperclip dist/ folder");
                _e = (_d = server).all;
                _f = [/^\/proxy\/.*/];
                return [4 /*yield*/, wrapRoute(proxy)];
            case 3:
                _e.apply(_d, _f.concat([_42.sent()]));
                // return all components
                _h = (_g = server).get;
                _j = ["/components"];
                return [4 /*yield*/, wrapRoute(getComponents)];
            case 4:
                // return all components
                _h.apply(_g, _j.concat([_42.sent()]));
                // return all components
                _l = (_k = server).get;
                _m = ["/screenshots/:screenshotHash"];
                return [4 /*yield*/, wrapRoute(getComponentsScreenshot)];
            case 5:
                // return all components
                _l.apply(_k, _m.concat([_42.sent()]));
                // return a module preview
                // all is OKAY since it's not a valid tag name
                _p = (_o = server).get;
                _q = ["/components/all/preview"];
                return [4 /*yield*/, wrapRoute(getAllComponentsPreview)];
            case 6:
                // return a module preview
                // all is OKAY since it's not a valid tag name
                _p.apply(_o, _q.concat([_42.sent()]));
                // return a module preview
                _s = (_r = server).get;
                _t = ["/components/:componentId/preview"];
                return [4 /*yield*/, wrapRoute(getComponentHTMLPreview)];
            case 7:
                // return a module preview
                _s.apply(_r, _t.concat([_42.sent()]));
                _v = (_u = server).get;
                _w = ["/components/:componentId/preview.json"];
                return [4 /*yield*/, wrapRoute(getComponentJSONPreview)];
            case 8:
                _v.apply(_u, _w.concat([_42.sent()]));
                _y = (_x = server).get;
                _z = ["/components/:componentId/preview/:previewName.json"];
                return [4 /*yield*/, wrapRoute(getComponentJSONPreview)];
            case 9:
                _y.apply(_x, _z.concat([_42.sent()]));
                _1 = (_0 = server).get;
                _2 = ["/components/:componentId/preview/:previewName"];
                return [4 /*yield*/, wrapRoute(getComponentHTMLPreview)];
            case 10:
                _1.apply(_0, _2.concat([_42.sent()]));
                _4 = (_3 = server).get;
                _5 = ["/components/:componentId/preview/:previewName/diff/:oldChecksum/:newChecksum.json"];
                return [4 /*yield*/, wrapRoute(getComponentJSONPreviewDiff)];
            case 11:
                _4.apply(_3, _5.concat([_42.sent()]));
                _7 = (_6 = server).get;
                _8 = ["/components/:componentId/preview/diff/:oldChecksum/:newChecksum.json"];
                return [4 /*yield*/, wrapRoute(getComponentJSONPreviewDiff)];
            case 12:
                _7.apply(_6, _8.concat([_42.sent()]));
                _10 = (_9 = server).get;
                _11 = ["/components/:componentId/preview/:previewName/source-info/:checksum/:vmObjectPath.json"];
                return [4 /*yield*/, wrapRoute(getVMObjectSoureInfo)];
            case 13:
                _10.apply(_9, _11.concat([_42.sent()]));
                _13 = (_12 = server).get;
                _14 = ["/components/:componentId/preview/source-info/:checksum/:vmObjectPath.json"];
                return [4 /*yield*/, wrapRoute(getVMObjectSoureInfo)];
            case 14:
                _13.apply(_12, _14.concat([_42.sent()]));
                // return all components
                _16 = (_15 = server).get;
                _17 = ["/components/:componentId/screenshots/:previewName/:screenshotHash"];
                return [4 /*yield*/, wrapRoute(getClippedComponentScreenshot)];
            case 15:
                // return all components
                _16.apply(_15, _17.concat([_42.sent()]));
                _19 = (_18 = server).get;
                _20 = ["/components/:componentId/screenshots/:previewName/:screenshotHash.png"];
                return [4 /*yield*/, wrapRoute(getClippedComponentScreenshot)];
            case 16:
                _19.apply(_18, _20.concat([_42.sent()]));
                // create a new component (creates a new module with a single component)
                _22 = (_21 = server).post;
                _23 = ["/components"];
                return [4 /*yield*/, wrapRoute(createComponent)];
            case 17:
                // create a new component (creates a new module with a single component)
                _22.apply(_21, _23.concat([_42.sent()]));
                // create a new component (creates a new module with a single component)
                _25 = (_24 = server).delete;
                _26 = ["/components/:componentId"];
                return [4 /*yield*/, wrapRoute(deleteComponent)];
            case 18:
                // create a new component (creates a new module with a single component)
                _25.apply(_24, _26.concat([_42.sent()]));
                // 
                _28 = (_27 = server).post;
                _29 = ["/watch"];
                return [4 /*yield*/, wrapRoute(watchUris)];
            case 19:
                // 
                _28.apply(_27, _29.concat([_42.sent()]));
                // edits a file
                _31 = (_30 = server).post;
                _32 = ["/edit"];
                return [4 /*yield*/, wrapRoute(editFiles)];
            case 20:
                // edits a file
                _31.apply(_30, _32.concat([_42.sent()]));
                // edits a file
                _34 = (_33 = server).post;
                _35 = ["/file"];
                return [4 /*yield*/, wrapRoute(setFileContent)];
            case 21:
                // edits a file
                _34.apply(_33, _35.concat([_42.sent()]));
                _37 = (_36 = server).get;
                _38 = ["/storage/:key"];
                return [4 /*yield*/, wrapRoute(getStorage)];
            case 22:
                _37.apply(_36, _38.concat([_42.sent()]));
                _40 = (_39 = server).post;
                _41 = ["/storage/:key"];
                return [4 /*yield*/, wrapRoute(setStorage)];
            case 23:
                _40.apply(_39, _41.concat([_42.sent()]));
                return [2 /*return*/];
        }
    });
}
function getFile(req, res) {
    var state, filePath, content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                filePath = path.join(utils_1.getModuleSourceDirectory(state), req.path);
                content = state_1.getFileCacheContent(filePath, state);
                if (content) {
                    res.setHeader("Content-Length", content.length);
                    res.setHeader("Cache-Control", "public, max-age=0");
                    res.send(content);
                }
                else {
                    return [2 /*return*/, res.sendFile(filePath)];
                }
                return [2 /*return*/];
        }
    });
}
function wrapRoute(route) {
    var handle, chan;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chan = redux_saga_1.eventChannel(function (emit) {
                    handle = function (req, res, next) {
                        emit([req, res, next]);
                    };
                    return function () { };
                });
                return [4 /*yield*/, effects_1.spawn(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!true) return [3 /*break*/, 2];
                                    return [4 /*yield*/, effects_1.spawn(function () {
                                            var _a, _b, _c;
                                            return __generator(this, function (_d) {
                                                switch (_d.label) {
                                                    case 0:
                                                        _b = (_a = route).apply;
                                                        _c = [void 0];
                                                        return [4 /*yield*/, effects_1.take(chan)];
                                                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.sent())]))];
                                                    case 2:
                                                        _d.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, function (req, res, next) {
                        handle(req, res, next);
                    }];
        }
    });
}
function getModuleFileContent(req, res, next) {
    var moduleId, state, targetModuleFilePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                moduleId = req.params.moduleId;
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                targetModuleFilePath = utils_1.getModuleFilePaths(state).find(function (filePath) { return utils_1.getModuleId(filePath) === moduleId; });
                if (!targetModuleFilePath)
                    next();
                res.sendFile(targetModuleFilePath);
                return [2 /*return*/];
        }
    });
}
function getAllComponentsPreview(req, res, next) {
    var state, entries, html;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                entries = utils_1.getPreviewComponentEntries(state);
                html = "\n  <html>\n    <head>\n      <title>All components</title>\n\n      <!-- paperclip used to compile templates in the browser -- primarily to reduce latency of \n      sending bundled files over a network, especially when there are many canvases. -->\n      <script type=\"text/javascript\" src=\"/paperclip.min.js\"></script>\n    </head>\n    <body>\n      <script>\n        const entries = " + JSON.stringify(entries) + ";\n        const _cache = {};\n\n        const onPreviewBundle = ({ componentId, previewName, bounds }, { code }) => {\n          const { entry, modules } = new Function(\"window\", \"with (window) { return \" + code + \"}\")(window);\n\n          const container = document.createElement(\"div\");\n          container.appendChild(entry.previews[componentId][previewName]());\n\n          Object.assign(container.style, { \n            position: \"absolute\", \n            overflow: \"hidden\",\n            left: bounds.left, \n            top: bounds.top, \n            width: bounds.right - bounds.left, \n            height: bounds.bottom - bounds.top \n          });\n          \n          document.body.appendChild(container);\n        };\n        \n        const loadNext = (entries, index, graph) => {\n\n          if (index >= entries.length) {\n\n            // selector flag for screenshot service\n            const element = document.createElement(\"span\");\n            element.setAttribute(\"class\", \"__ready\");\n            document.body.appendChild(element);\n            return Promise.resolve();\n          }\n\n          const entry = entries[index];\n\n          paperclip.bundleVanilla(entry.relativeFilePath, {\n            io: {\n              readFile(uri) {\n\n                return _cache[uri] ? _cache[uri] : _cache[uri] = fetch(uri)\n                .then((response) => response.text())\n                .then(text => _cache[uri] = Promise.resolve(text))\n              }\n            }\n          })\n          .then(onPreviewBundle.bind(this, entry))\n          .then(loadNext.bind(this, entries, index + 1, graph));\n        };\n\n        loadNext(entries, 0, {});\n      </script>\n    </body>\n  </html>\n  ";
                res.send(html);
                return [2 /*return*/];
        }
    });
}
function createComponent(req, res) {
    var name, state, componentId, content, filePath, publicPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPostData(req)];
            case 1:
                name = (_a.sent()).name;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                componentId = lodash_1.kebabCase(name);
                content = "" +
                    ("<component id=\"" + componentId + "\">\n") +
                    "  <style>\n" +
                    "  </style>\n" +
                    "  <template>\n" +
                    "  </template>\n" +
                    "</component>\n\n" +
                    ("<component id=\"" + componentId + "-preview\">\n") +
                    ("  <meta name=\"preview\" content=\"of=" + componentId + ", width=400, height=400\"></meta>\n") +
                    "  <template>\n" +
                    ("    <" + componentId + " />\n") +
                    "  </template>\n" +
                    "</component>\n";
                filePath = path.join(utils_1.getModuleSourceDirectory(state), componentId + "." + constants_1.PAPERCLIP_FILE_EXTENSION);
                if (fs.existsSync(filePath)) {
                    res.statusCode = 500;
                    return [2 /*return*/, res.send({
                            message: "Component exists"
                        })];
                }
                fs.writeFileSync(filePath, content);
                publicPath = utils_1.getPublicSrcPath(filePath, state);
                return [4 /*yield*/, effects_1.put(actions_1.moduleCreated(filePath, publicPath, content))];
            case 3:
                _a.sent();
                res.send({ componentId: componentId });
                return [2 /*return*/];
        }
    });
}
function getStorage(req, res, next) {
    var data, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.getStorageData;
                _b = [req.params.key];
                return [4 /*yield*/, effects_1.select()];
            case 1:
                data = _a.apply(void 0, _b.concat([_c.sent()]));
                if (!data) {
                    return [2 /*return*/, next()];
                }
                return [2 /*return*/, res.send(data)];
        }
    });
}
function setStorage(req, res) {
    var body, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, getPostData(req)];
            case 1:
                body = _c.sent();
                _a = utils_1.setStorageData;
                _b = [req.params.key, body];
                return [4 /*yield*/, effects_1.select()];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                res.send([]);
                return [2 /*return*/];
        }
    });
}
function deleteComponent(req, res, next) {
    var state, componentId, readFile, allModules, dependents, targetModule, targetComponent, previewComponent, _i, allModules_1, module_1, _a, _b, component, pmeta, childElementNames, oldContent, content;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _c.sent();
                componentId = req.params.componentId;
                readFile = utils_1.getReadFile(state);
                allModules = utils_1.getAllModules(state);
                dependents = [];
                for (_i = 0, allModules_1 = allModules; _i < allModules_1.length; _i++) {
                    module_1 = allModules_1[_i];
                    for (_a = 0, _b = module_1.components; _a < _b.length; _a++) {
                        component = _b[_a];
                        if (!targetModule && component.id === componentId) {
                            targetModule = module_1;
                            targetComponent = component;
                            continue;
                        }
                        pmeta = paperclip_2.getComponentMetadataItem(component, "preview");
                        if (pmeta && pmeta.params.of === componentId) {
                            previewComponent = component;
                            continue;
                        }
                        childElementNames = paperclip_2.getAllChildElementNames(component.template);
                        if (childElementNames.indexOf(componentId) !== -1) {
                            dependents.push(module_1);
                        }
                    }
                }
                if (!targetModule) {
                    res.statusCode = 404;
                    return [2 /*return*/, res.send({
                            message: "Could not find component"
                        })];
                }
                ;
                if (dependents.length) {
                    res.statusCode = 500;
                    return [2 /*return*/, res.send({
                            message: "Component references in " + dependents.map(function (dep) { return dep.uri; }) + " must be removed before deleting " + componentId
                        })];
                }
                oldContent = readFile(targetModule.uri);
                content = source_mutation_1.editString(oldContent, paperclip_2.editPaperclipSource(oldContent, paperclip_1.createPCRemoveNodeMutation(targetComponent.source)).concat((previewComponent ? paperclip_2.editPaperclipSource(oldContent, paperclip_1.createPCRemoveNodeMutation(previewComponent.source)) : [])));
                return [4 /*yield*/, effects_1.put(actions_1.fileContentChanged(targetModule.uri, utils_1.getPublicFilePath(targetModule.uri, state), content, new Date()))];
            case 2:
                _c.sent();
                res.send({});
                return [2 /*return*/];
        }
    });
}
function proxy(req, res) {
    var _a, match, uri;
    return __generator(this, function (_b) {
        _a = req.path.match(/proxy\/(.+)/), match = _a[0], uri = _a[1];
        uri = decodeURIComponent(uri);
        req.url = uri;
        req.pipe(request({
            uri: uri
        }).on("error", function (err) {
            res.statusCode = 500;
            res.send(err.stack);
        })).pipe(res);
        return [2 /*return*/];
    });
}
function getComponents(req, res) {
    var state, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _c.sent();
                _b = (_a = res).send;
                return [4 /*yield*/, effects_1.call(utils_1.getAvailableComponents, state, utils_1.getReadFile(state))];
            case 2:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}
function getComponentsScreenshotFromReq(req) {
    var state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                if (!state.componentScreenshots.length) {
                    return [2 /*return*/, null];
                }
                if (req.params.screenshotHash === "latest") {
                    return [2 /*return*/, state.componentScreenshots[state.componentScreenshots.length - 1]];
                }
                return [2 /*return*/, state.componentScreenshots.find(function (screenshot) { return md5(screenshot.uri) === req.params.screenshotHash; })];
        }
    });
}
function getComponentsScreenshot(req, res, next) {
    var state, uri;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                return [4 /*yield*/, effects_1.call(getComponentsScreenshotFromReq, req)];
            case 2:
                uri = ((_a.sent()) || { uri: null }).uri;
                if (!uri) {
                    return [2 /*return*/, next()];
                }
                res.sendFile(uri);
                return [2 /*return*/];
        }
    });
}
function getClippedComponentScreenshot(req, res, next) {
    var state, _a, componentId, previewName, uri, _b, maxWidth, maxHeight, screenshot, box, cw, ch, stream, scale, scale, buffer;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _c.sent();
                _a = req.params, componentId = _a.componentId, previewName = _a.previewName;
                return [4 /*yield*/, effects_1.call(getComponentsScreenshotFromReq, req)];
            case 2:
                uri = ((_c.sent()) || { uri: null }).uri;
                _b = req.query, maxWidth = _b.maxWidth, maxHeight = _b.maxHeight;
                if (!uri) {
                    return [2 /*return*/, next()];
                }
                screenshot = utils_1.getComponentScreenshot(componentId, previewName, state);
                if (!screenshot) {
                    return [2 /*return*/, next()];
                }
                box = {
                    left: screenshot.clip.left,
                    top: screenshot.clip.top,
                    width: screenshot.clip.right - screenshot.clip.left,
                    height: screenshot.clip.bottom - screenshot.clip.top,
                };
                cw = box.width;
                ch = box.height;
                stream = sharp(uri).extract(box);
                if (maxWidth && cw > Number(maxWidth)) {
                    scale = Number(maxWidth) / cw;
                    cw *= scale;
                    ch *= scale;
                }
                if (maxHeight && ch > Number(maxHeight)) {
                    scale = Number(maxHeight) / ch;
                    cw *= scale;
                    ch *= scale;
                }
                if (cw !== box.width) {
                    stream = stream.resize(Math.round(cw), Math.round(ch));
                }
                return [4 /*yield*/, effects_1.call(stream.toBuffer.bind(stream))];
            case 3:
                buffer = _c.sent();
                res.setHeader("Content-Length", buffer.length);
                res.setHeader("Content-Type", "image/png");
                res.setHeader("Accept-Ranges", "bytes");
                res.setHeader("Connection", "keep-alive");
                res.end(buffer);
                return [2 /*return*/];
        }
    });
}
function getPostData(req) {
    var chan;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chan = redux_saga_1.eventChannel(function (emit) {
                    var buffer = [];
                    req.on("data", function (chunk) { return buffer.push(chunk); });
                    req.on("end", function () { return emit(JSON.parse(buffer.join(""))); });
                    return function () { };
                });
                return [4 /*yield*/, effects_1.take(chan)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}
function watchUris(req, res) {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.call(getPostData, req)];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.watchUrisRequested(data))];
            case 2:
                _a.sent();
                res.send([]);
                return [2 /*return*/];
        }
    });
}
var getTranspileOptions = aerial_common2_1.weakMemo(function (state) { return ({
    assignTo: "bundle",
    readFileSync: utils_1.getReadFile(state)
}); });
function getComponentHTMLPreview(req, res) {
    var state, _a, componentId, previewName, components, targetComponent, relativeModuleFilePath, content, html;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                _a = req.params, componentId = _a.componentId, previewName = _a.previewName;
                return [4 /*yield*/, effects_1.call(utils_1.getAvailableComponents, state, utils_1.getReadFile(state))];
            case 2:
                components = (_b.sent());
                targetComponent = components.find(function (component) { return component.tagName === componentId; });
                if (!targetComponent || !targetComponent.filePath) {
                    res.status(404);
                    return [2 /*return*/, res.send("Component not found")];
                }
                relativeModuleFilePath = utils_1.getPublicSrcPath(targetComponent.filePath, state);
                html = "\n  <html>\n    <head>\n      <title>" + targetComponent.label + "</title>\n\n      <!-- paperclip used to compile templates in the browser -- primarily to reduce latency of \n      sending bundled files over a network, especially when there are many canvases. -->\n      <script type=\"text/javascript\" src=\"/paperclip.min.js\"></script>\n    </head>\n    <body>\n      <script>\n        let _loadedDocument;\n        const componentId = " + JSON.stringify(componentId) + ";\n        const previewName = " + JSON.stringify(previewName) + ";\n\n        // hook into synthetic document's load cycle -- ensure\n        // that it doesn't emit a load event until the paperclip module\n        // preview has been added to the document body\n        document.interactiveLoaded = new Promise((resolve) => {\n          _loadedDocument = resolve;\n        });\n\n        let _cache = {};\n\n        paperclip.bundleVanilla(\"" + targetComponent.filePath + "\", {\n          io: {\n            readFile(uri) {\n              return _cache[uri] ? _cache[uri] : _cache[uri] = fetch(uri.replace(\"" + utils_1.getModuleSourceDirectory(state) + "\", \"" + constants_2.PUBLIC_SRC_DIR_PATH + "\")).then((response) => response.text()).then((text) => _cache[uri] = Promise.resolve(text));\n            }\n          }\n        }).then(({ code, warnings, entryDependency }) => {\n          const { entry, modules } = new Function(\"window\", \"with (window) { return \" + code + \"}\")(window);\n\n          const targetComponent = entryDependency.module.components.find(component => component.id == componentId);\n          const preview = previewName ? entry.previews[componentId][previewName] : entry.previews[componentId][Object.keys(entry.previews[componentId])[0]];\n\n          if (!preview) {\n            return document.body.appendChild(document.createTextNode(\"Unable to find preview of component \" + previewTargetComponentId));\n          }\n          const element = preview();\n\n          // attach source so that modules can be meta clicked\n          element.source = { uri: \"" + targetComponent.filePath + "\" };\n          document.body.appendChild(element);\n        }).then(_loadedDocument);\n      </script>\n    </body>\n  </html>\n  ";
                res.send(html);
                return [2 /*return*/];
        }
    });
}
function getComponentJSONPreview(req, res, next) {
    var state, _a, componentId, previewName, document;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                _a = req.params, componentId = _a.componentId, previewName = _a.previewName;
                document = state_1.getLatestPreviewDocument(componentId, previewName, state);
                if (!document) {
                    return [2 /*return*/, next()];
                }
                return [2 /*return*/, res.send(slim_dom_1.compressRootNode(document))];
        }
    });
}
function getComponentJSONPreviewDiff(req, res, next) {
    var state, _a, componentId, previewName, oldChecksum, newChecksum, oldDocument, newDocument;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                _a = req.params, componentId = _a.componentId, previewName = _a.previewName, oldChecksum = _a.oldChecksum, newChecksum = _a.newChecksum;
                oldDocument = state_1.getPreviewDocumentByChecksum(componentId, previewName, oldChecksum, state);
                newDocument = state_1.getPreviewDocumentByChecksum(componentId, previewName, newChecksum, state);
                if (!oldDocument) {
                    return [2 /*return*/, next()];
                }
                if (!newDocument) {
                    return [2 /*return*/, next()];
                }
                return [2 /*return*/, res.send(slim_dom_1.diffNode(oldDocument, newDocument))];
        }
    });
}
function getVMObjectSoureInfo(req, res, next) {
    var state, _a, componentId, previewName, checksum, vmObjectPath, document, target;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                _a = req.params, componentId = _a.componentId, previewName = _a.previewName, checksum = _a.checksum, vmObjectPath = _a.vmObjectPath;
                document = state_1.getPreviewDocumentByChecksum(componentId, previewName, checksum, state);
                if (!document) {
                    console.log("Cannot find vm source info doc");
                    return [2 /*return*/, next()];
                }
                target = slim_dom_1.getVMObjectFromPath(vmObjectPath.split("."), document);
                if (!target) {
                    return [2 /*return*/, next()];
                }
                res.send(target.source);
                return [2 /*return*/];
        }
    });
}
function setFileContent(req, res, next) {
    var _a, filePath, content, mtime, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getPostData(req)];
            case 1:
                _a = _b.sent(), filePath = _a.filePath, content = _a.content, mtime = _a.mtime;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                return [4 /*yield*/, effects_1.put(actions_1.fileContentChanged(filePath, utils_1.getPublicFilePath(filePath, state), content, new Date(mtime)))];
            case 3:
                _b.sent();
                res.send("\"ok\"");
                return [2 /*return*/];
        }
    });
}
function editFiles(req, res, next) {
    return __generator(this, function (_a) {
        // const mutationsByUri = yield call(getPostData, req);
        // const state: ApplicationState = yield select();
        // const result: any = {};
        // for (const uri in mutationsByUri) {
        //   if (uri.substr(0, 5) !== "file:") continue;
        //   const filePath = path.normalize(uri.substr(7));
        //   const fileCacheItem = state.fileCache.find((item) => item.filePath === filePath);
        //   if (!fileCacheItem) {
        //     console.warn(`${filePath} was not found in cache, cannot edit!`);
        //     continue;
        //   }
        //   // TODO - add history here
        //   const mutations = mutationsByUri[uri];
        //   const oldContent = fileCacheItem.content.toString("utf8");
        //   const stringMutations = flatten(mutations.map(editPCContent.bind(this, oldContent))) as StringMutation[];
        //   const newContent = editString(oldContent, stringMutations);
        //   result[uri] = newContent;
        //   yield put(fileContentChanged(filePath, new Buffer(newContent, "utf8"), new Date()));
        //   yield put(fileChanged(filePath)); // dispatch public change -- causes reload
        // }
        // res.send(result);
        next();
        return [2 /*return*/];
    });
}
function setFile(req, res) {
    var _a, filePath, content, state, publicPath;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.call(getPostData, req)];
            case 1:
                _a = _b.sent(), filePath = _a.filePath, content = _a.content;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                publicPath = utils_1.getPublicFilePath(filePath, state);
                return [4 /*yield*/, effects_1.put(actions_1.fileContentChanged(filePath, publicPath, content, new Date()))];
            case 3:
                _b.sent();
                res.send([]);
                return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=api.js.map