"use strict";
// this bridge file will be injected into TypeScript service
// it enable type checking and completion, yet still preserve precise option type
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleName = 'pap-editor-bridge';
exports.fileName = 'vue-temp/vue-editor-bridge.ts';
exports.oldContent = "\nimport Vue from 'vue';\nexport interface GeneralOption extends Vue.ComponentOptions<Vue> {\n  [key: string]: any;\n}\nexport default function bridge<T>(t: T & GeneralOption): T {\n  return t;\n}";
exports.content = "\nimport Vue from 'vue';\nconst func = Vue.extend;\nexport default func;\n";
//# sourceMappingURL=bridge.js.map