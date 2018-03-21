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
var path = require("path");
var ts = require("typescript");
var vscode_uri_1 = require("vscode-uri");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var parseGitIgnore = require("parse-gitignore");
var preprocess_1 = require("./preprocess");
var paths_1 = require("../../utils/paths");
var bridge = require("./bridge");
function isVueProject(path) {
    return path.endsWith('.vue.ts') && !path.includes('node_modules');
}
function defaultIgnorePatterns(workspacePath) {
    var nodeModules = ['node_modules', '**/node_modules/*'];
    var gitignore = ts.findConfigFile(workspacePath, ts.sys.fileExists, '.gitignore');
    if (!gitignore) {
        return nodeModules;
    }
    var parsed = parseGitIgnore(gitignore);
    var filtered = parsed.filter(function (s) { return !s.startsWith('!'); });
    return nodeModules.concat(filtered);
}
var vueSys = __assign({}, ts.sys, { fileExists: function (path) {
        if (isVueProject(path)) {
            return ts.sys.fileExists(path.slice(0, -3));
        }
        return ts.sys.fileExists(path);
    },
    readFile: function (path, encoding) {
        if (isVueProject(path)) {
            var fileText = ts.sys.readFile(path.slice(0, -3), encoding);
            return fileText ? preprocess_1.parseVue(fileText) : fileText;
        }
        else {
            var fileText = ts.sys.readFile(path, encoding);
            return fileText;
        }
    } });
if (ts.sys.realpath) {
    var realpath_1 = ts.sys.realpath;
    vueSys.realpath = function (path) {
        if (isVueProject(path)) {
            return realpath_1(path.slice(0, -3)) + '.ts';
        }
        return realpath_1(path);
    };
}
function getScriptKind(langId) {
    return langId === 'typescript' ? ts.ScriptKind.TS : langId === 'tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.JS;
}
function inferIsOldVersion(workspacePath) {
    var packageJSONPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, 'package.json');
    try {
        var packageJSON = packageJSONPath && JSON.parse(ts.sys.readFile(packageJSONPath));
        var vueStr = packageJSON.dependencies.vue || packageJSON.devDependencies.vue;
        // use a sloppy method to infer version, to reduce dep on semver or so
        var vueDep = vueStr.match(/\d+\.\d+/)[0];
        var sloppyVersion = parseFloat(vueDep);
        return sloppyVersion < 2.5;
    }
    catch (e) {
        return true;
    }
}
function getServiceHost(workspacePath, jsDocuments) {
    var compilerOptions = {
        allowNonTsExtensions: true,
        allowJs: true,
        lib: ['lib.dom.d.ts', 'lib.es2017.d.ts'],
        target: ts.ScriptTarget.Latest,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.Preserve,
        allowSyntheticDefaultImports: true
    };
    var currentScriptDoc;
    var versions = new Map();
    var scriptDocs = new Map();
    // Patch typescript functions to insert `import Vue from 'vue'` and `new Vue` around export default.
    // NOTE: Typescript 2.3 should add an API to allow this, and then this code should use that API.
    var _a = preprocess_1.createUpdater(), createLanguageServiceSourceFile = _a.createLanguageServiceSourceFile, updateLanguageServiceSourceFile = _a.updateLanguageServiceSourceFile;
    ts.createLanguageServiceSourceFile = createLanguageServiceSourceFile;
    ts.updateLanguageServiceSourceFile = updateLanguageServiceSourceFile;
    var configFilename = ts.findConfigFile(workspacePath, ts.sys.fileExists, 'tsconfig.json') ||
        ts.findConfigFile(workspacePath, ts.sys.fileExists, 'jsconfig.json');
    var configJson = (configFilename && ts.readConfigFile(configFilename, ts.sys.readFile).config) || {
        exclude: defaultIgnorePatterns(workspacePath)
    };
    var parsedConfig = ts.parseJsonConfigFileContent(configJson, ts.sys, workspacePath, {}, configFilename, undefined, [
        { extension: 'vue', isMixedContent: true }
    ]);
    var files = parsedConfig.fileNames;
    var isOldVersion = inferIsOldVersion(workspacePath);
    compilerOptions = __assign({}, compilerOptions, parsedConfig.options);
    compilerOptions.allowNonTsExtensions = true;
    function updateCurrentTextDocument(doc) {
        var fileFsPath = paths_1.getFileFsPath(doc.uri);
        var filePath = paths_1.getFilePath(doc.uri);
        // When file is not in language service, add it
        if (!scriptDocs.has(fileFsPath)) {
            if (fileFsPath.endsWith('.vue')) {
                files.push(filePath);
            }
        }
        if (!currentScriptDoc || doc.uri !== currentScriptDoc.uri || doc.version !== currentScriptDoc.version) {
            currentScriptDoc = jsDocuments.get(doc);
            var lastDoc = scriptDocs.get(fileFsPath);
            if (lastDoc && currentScriptDoc.languageId !== lastDoc.languageId) {
                // if languageId changed, restart the language service; it can't handle file type changes
                jsLanguageService.dispose();
                jsLanguageService = ts.createLanguageService(host);
            }
            scriptDocs.set(fileFsPath, currentScriptDoc);
            versions.set(fileFsPath, (versions.get(fileFsPath) || 0) + 1);
        }
        return {
            service: jsLanguageService,
            scriptDoc: currentScriptDoc
        };
    }
    function getScriptDocByFsPath(fsPath) {
        return scriptDocs.get(fsPath);
    }
    var host = {
        getCompilationSettings: function () { return compilerOptions; },
        getScriptFileNames: function () { return files; },
        getScriptVersion: function (fileName) {
            if (fileName === bridge.fileName) {
                return '0';
            }
            var normalizedFileFsPath = getNormalizedFileFsPath(fileName);
            var version = versions.get(normalizedFileFsPath);
            return version ? version.toString() : '0';
        },
        getScriptKind: function (fileName) {
            if (preprocess_1.isVue(fileName)) {
                var uri = vscode_uri_1.default.file(fileName);
                fileName = uri.fsPath;
                var doc = scriptDocs.get(fileName) ||
                    jsDocuments.get(vscode_languageserver_types_1.TextDocument.create(uri.toString(), 'vue', 0, ts.sys.readFile(fileName) || ''));
                return getScriptKind(doc.languageId);
            }
            else {
                if (fileName === bridge.fileName) {
                    return ts.Extension.Ts;
                }
                // NOTE: Typescript 2.3 should export getScriptKindFromFileName. Then this cast should be removed.
                return ts.getScriptKindFromFileName(fileName);
            }
        },
        // resolve @types, see https://github.com/Microsoft/TypeScript/issues/16772
        getDirectories: vueSys.getDirectories,
        directoryExists: vueSys.directoryExists,
        fileExists: vueSys.fileExists,
        readFile: vueSys.readFile,
        readDirectory: vueSys.readDirectory,
        resolveModuleNames: function (moduleNames, containingFile) {
            // in the normal case, delegate to ts.resolveModuleName
            // in the relative-imported.vue case, manually build a resolved filename
            return moduleNames.map(function (name) {
                if (name === bridge.moduleName) {
                    return {
                        resolvedFileName: bridge.fileName,
                        extension: ts.Extension.Ts
                    };
                }
                if (path.isAbsolute(name) || !preprocess_1.isVue(name)) {
                    return ts.resolveModuleName(name, containingFile, compilerOptions, ts.sys).resolvedModule;
                }
                var resolved = ts.resolveModuleName(name, containingFile, compilerOptions, vueSys).resolvedModule;
                if (!resolved) {
                    return undefined;
                }
                if (!resolved.resolvedFileName.endsWith('.vue.ts')) {
                    return resolved;
                }
                var resolvedFileName = resolved.resolvedFileName.slice(0, -3);
                var uri = vscode_uri_1.default.file(resolvedFileName);
                var doc = scriptDocs.get(resolvedFileName) ||
                    jsDocuments.get(vscode_languageserver_types_1.TextDocument.create(uri.toString(), 'vue', 0, ts.sys.readFile(resolvedFileName) || ''));
                var extension = doc.languageId === 'typescript'
                    ? ts.Extension.Ts
                    : doc.languageId === 'tsx' ? ts.Extension.Tsx : ts.Extension.Js;
                return { resolvedFileName: resolvedFileName, extension: extension };
            });
        },
        getScriptSnapshot: function (fileName) {
            if (fileName === bridge.fileName) {
                var text_1 = isOldVersion ? bridge.oldContent : bridge.content;
                return {
                    getText: function (start, end) { return text_1.substring(start, end); },
                    getLength: function () { return text_1.length; },
                    getChangeRange: function () { return void 0; }
                };
            }
            var normalizedFileFsPath = getNormalizedFileFsPath(fileName);
            var doc = scriptDocs.get(normalizedFileFsPath);
            var fileText = doc ? doc.getText() : ts.sys.readFile(normalizedFileFsPath) || '';
            if (!doc && preprocess_1.isVue(fileName)) {
                // Note: This is required in addition to the parsing in embeddedSupport because
                // this works for .vue files that aren't even loaded by VS Code yet.
                fileText = preprocess_1.parseVue(fileText);
            }
            return {
                getText: function (start, end) { return fileText.substring(start, end); },
                getLength: function () { return fileText.length; },
                getChangeRange: function () { return void 0; }
            };
        },
        getCurrentDirectory: function () { return workspacePath; },
        getDefaultLibFileName: ts.getDefaultLibFilePath
    };
    var jsLanguageService = ts.createLanguageService(host);
    return {
        updateCurrentTextDocument: updateCurrentTextDocument,
        getScriptDocByFsPath: getScriptDocByFsPath,
        getService: function () { return jsLanguageService; }
    };
}
exports.getServiceHost = getServiceHost;
function getNormalizedFileFsPath(fileName) {
    return vscode_uri_1.default.file(fileName).fsPath;
}
//# sourceMappingURL=serviceHost.js.map