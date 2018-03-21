"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlTags_1 = require("./htmlTags");
var vueTags_1 = require("./vueTags");
var routerTags_1 = require("./routerTags");
var externalTagProviders_1 = require("./externalTagProviders");
var componentTags_1 = require("./componentTags");
exports.getComponentTags = componentTags_1.getComponentTags;
var ts = require("typescript");
var fs = require("fs");
exports.allTagProviders = [
    htmlTags_1.getHTML5TagProvider(),
    vueTags_1.getVueTagProvider(),
    routerTags_1.getRouterTagProvider(),
    externalTagProviders_1.elementTagProvider
];
function getTagProviderSettings(workspacePath) {
    var settings = {
        html5: true,
        vue: true,
        router: false,
        element: false,
        onsen: false,
        bootstrap: false
    };
    if (!workspacePath) {
        return settings;
    }
    try {
        var packagePath = ts.findConfigFile(workspacePath, ts.sys.fileExists, 'package.json');
        var packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        if (packageJson.dependencies['vue-router']) {
            settings['router'] = true;
        }
        if (packageJson.dependencies['element-ui']) {
            settings['element'] = true;
        }
        if (packageJson.dependencies['vue-onsenui']) {
            settings['onsen'] = true;
        }
        if (packageJson.dependencies['bootstrap-vue']) {
            settings['bootstrap'] = true;
        }
    }
    catch (e) { }
    return settings;
}
exports.getTagProviderSettings = getTagProviderSettings;
function getEnabledTagProviders(tagProviderSetting) {
    return exports.allTagProviders.filter(function (p) { return tagProviderSetting[p.getId()] !== false; });
}
exports.getEnabledTagProviders = getEnabledTagProviders;
//# sourceMappingURL=index.js.map