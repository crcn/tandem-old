"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
require('babel-polyfill');
const application_1 = require('./application');
const lodash_1 = require('lodash');
const queryConfig = window.location.search && false ? JSON.parse(decodeURIComponent(window.location.search.substr(1))) : {};
var app = window['app'] = new application_1.default(lodash_1.merge({}, window['config'] || {}, queryConfig));
window.addEventListener('unhandledrejection', event => console.error(event));
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        for (var bundleName in window['Saffron']) {
            var bundle = window['Saffron'][bundleName];
            if (!bundle.fragment)
                continue;
            app.logger.info('registering bundle %s', bundleName);
            app.fragments.register(bundle.fragment);
        }
        app.setProperties({
            element: document.getElementById('app')
        });
        yield app.initialize().then();
    });
};
//# sourceMappingURL=entry.js.map