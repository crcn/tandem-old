"use strict";
// TODO - many useful functions here that should be moved to the paperclip repository
// when more transpilers are created
Object.defineProperty(exports, "__esModule", { value: true });
var paperclip_1 = require("paperclip");
var path = require("path");
var lodash_1 = require("lodash");
exports.ATTRIBUTE_MAP = {
    "class": "className",
    // events - https://developer.mozilla.org/en-US/docs/Web/Events
    // Mouse events
    "mouseenter": "onMouseEnter",
    "mouseover": "onMouseOver",
    "mousemove": "onMouseMove",
    "onmousedown": "onMouseDown",
    "onmouseup": "onMouseUp",
    "auxclick": "onAuxClick",
    "onclick": "onClick",
    "ondblclick": "onDoubleClick",
    "oncontextmenu": "onContextMenu",
    "onmousewheel": "onMouseWheel",
    "onmouseleave": "onMouseLeave",
    "onmouseout": "onMouseOut",
    "onselect": "onSelect",
    "pointerlockchange": "onPointerLockChange",
    "pointerlockerror": "onPointerLockError",
    // DND
    "ondragstart": "onDragStart",
    "ondrag": "onDrag",
    "ondragend": "onDragEnd",
    "ondragenter": "onDragEnter",
    "ondragover": "onDragOver",
    "ondragleave": "onDragLeave",
    "ondrop": "onDrop",
    // Keyboard
    "onkeydown": "onKeyDown",
    "onkeypfress": "onKeyPress",
    "onkeyup": "onKeyUp",
    // Form
    "onreset": "onReset",
    "onsubmit": "onSubmit",
    // Focus
    "onfocus": "onFocus",
    "onblur": "onBlur",
};
exports.getComponentClassName = function (tagName) { return lodash_1.upperFirst(lodash_1.camelCase(tagName)); };
exports.getComponentTranspileInfo = function (component) {
    var className = exports.getComponentClassName(component.id);
    return {
        component: component,
        className: className,
        enhancerTypeName: className + "Enhancer",
        propTypesName: className + "InnerProps",
        enhancerName: "enhance" + className,
    };
};
exports.getComponentFromModule = function (id, module) { return module.type === paperclip_1.PCModuleType.COMPONENT ? module.components.find(function (component) { return component.id === id; }) : null; };
exports.getSlotName = function (name) { return lodash_1.camelCase(name.replace(/-/g, "_")) + "Slot"; };
exports.getTemplateSlotNames = function (root) {
    var slotNames = [];
    paperclip_1.traversePCAST(root, function (child) {
        if (paperclip_1.isTag(child) && paperclip_1.getStartTag(child).name === "slot") {
            var slotName = paperclip_1.getPCStartTagAttribute(child, "name");
            slotNames.push(slotName ? exports.getSlotName(paperclip_1.getPCStartTagAttribute(child, "name")) : "children");
        }
    });
    return lodash_1.uniq(slotNames);
};
exports.getImportBaseName = function (href) { return lodash_1.upperFirst(lodash_1.camelCase(path.basename(href).split(".").shift())); };
exports.getImportsInfo = function (entry, allDeps) {
    var importTranspileInfo = [];
    allDeps.forEach(function (dependency, i) {
        // using var define in itself
        if (dependency === entry) {
            return;
        }
        var varName = "imports_" + i;
        var relativePath = path.relative(path.dirname(entry.module.uri), dependency.module.uri);
        if (relativePath.charAt(0) !== ".") {
            relativePath = "./" + relativePath;
        }
        importTranspileInfo.push({
            varName: varName,
            dependency: dependency,
            relativePath: relativePath,
            baseName: exports.getImportBaseName(dependency.module.uri)
        });
    });
    return importTranspileInfo;
};
exports.getImportFromDependency = function (_imports, dep) { return _imports.find(function (_import) { return _import.dependency.module.uri === dep.module.uri; }); };
//# sourceMappingURL=utils.js.map