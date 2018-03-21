"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var index_1 = require("./index");
var baseConfig = Object.assign({}, {
    storageNamespace: "tandem",
    apiHost: ((location.hash || "").match(/api=([^&]+)/) || [null, "http://localhost:8082"])[1],
}, window["config"] || {});
var state = index_1.createApplicationState(__assign({}, baseConfig, { element: typeof document !== "undefined" ? document.getElementById("application") : undefined, log: {
        level: aerial_common2_1.LogLevel.VERBOSE
    } }));
var workspace = index_1.createWorkspace({});
state = index_1.addWorkspace(state, workspace);
state = index_1.selectWorkspace(state, workspace.$id);
index_1.initApplication(state);
//# sourceMappingURL=entry.js.map