"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SEnvNodeTypes;
(function (SEnvNodeTypes) {
    SEnvNodeTypes[SEnvNodeTypes["ELEMENT"] = 1] = "ELEMENT";
    SEnvNodeTypes[SEnvNodeTypes["ATTR"] = 2] = "ATTR";
    SEnvNodeTypes[SEnvNodeTypes["TEXT"] = 3] = "TEXT";
    SEnvNodeTypes[SEnvNodeTypes["CDATA_SECTION"] = 4] = "CDATA_SECTION";
    SEnvNodeTypes[SEnvNodeTypes["ENTITY_REFERENCE"] = 5] = "ENTITY_REFERENCE";
    SEnvNodeTypes[SEnvNodeTypes["ENTITY"] = 6] = "ENTITY";
    SEnvNodeTypes[SEnvNodeTypes["PROCESSING_INSTRUCTION"] = 7] = "PROCESSING_INSTRUCTION";
    SEnvNodeTypes[SEnvNodeTypes["COMMENT"] = 8] = "COMMENT";
    SEnvNodeTypes[SEnvNodeTypes["DOCUMENT"] = 9] = "DOCUMENT";
    SEnvNodeTypes[SEnvNodeTypes["DOCUMENT_TYPE"] = 10] = "DOCUMENT_TYPE";
    SEnvNodeTypes[SEnvNodeTypes["DOCUMENT_FRAGMENT"] = 11] = "DOCUMENT_FRAGMENT";
    SEnvNodeTypes[SEnvNodeTypes["NOTATION"] = 12] = "NOTATION";
})(SEnvNodeTypes = exports.SEnvNodeTypes || (exports.SEnvNodeTypes = {}));
;
// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
var CSSRuleType;
(function (CSSRuleType) {
    CSSRuleType[CSSRuleType["STYLE_RULE"] = 0] = "STYLE_RULE";
    CSSRuleType[CSSRuleType["CHARSET_RULE"] = 1] = "CHARSET_RULE";
    CSSRuleType[CSSRuleType["IMPORT_RULE"] = 2] = "IMPORT_RULE";
    CSSRuleType[CSSRuleType["MEDIA_RULE"] = 3] = "MEDIA_RULE";
    CSSRuleType[CSSRuleType["FONT_FACE_RULE"] = 4] = "FONT_FACE_RULE";
    CSSRuleType[CSSRuleType["PAGE_RULE"] = 5] = "PAGE_RULE";
    CSSRuleType[CSSRuleType["KEYFRAMES_RULE"] = 6] = "KEYFRAMES_RULE";
    CSSRuleType[CSSRuleType["KEYFRAME_RULE"] = 7] = "KEYFRAME_RULE";
    CSSRuleType[CSSRuleType["__FUTURE_NS"] = 8] = "__FUTURE_NS";
    CSSRuleType[CSSRuleType["NAMESPACE_RULE"] = 9] = "NAMESPACE_RULE";
    CSSRuleType[CSSRuleType["COUNTER_STYLE_RULE"] = 10] = "COUNTER_STYLE_RULE";
    CSSRuleType[CSSRuleType["SUPPORTS_RULE"] = 11] = "SUPPORTS_RULE";
    CSSRuleType[CSSRuleType["DOCUMENT_RULE"] = 12] = "DOCUMENT_RULE";
    CSSRuleType[CSSRuleType["FONT_FEATURE_VALUES_RULE"] = 13] = "FONT_FEATURE_VALUES_RULE";
    CSSRuleType[CSSRuleType["VIEWPORT_RULE"] = 14] = "VIEWPORT_RULE";
    CSSRuleType[CSSRuleType["REGION_STYLE_RULE"] = 15] = "REGION_STYLE_RULE";
    CSSRuleType[CSSRuleType["UNKNOWN_RULE"] = 16] = "UNKNOWN_RULE";
})(CSSRuleType = exports.CSSRuleType || (exports.CSSRuleType = {}));
;
exports.DEFAULT_WINDOW_WIDTH = 1366;
exports.DEFAULT_WINDOW_HEIGHT = 768;
exports.SVG_XMLNS = "http://www.w3.org/2000/svg";
exports.HTML_XMLNS = "http://www.w3.org/1999/xhtml";
//# sourceMappingURL=constants.js.map