"use strict";
const assert = require('assert');
const lodash_1 = require('lodash');
const collection_1 = require('../object/collection');
class FragmentCollection extends collection_1.default {
    constructor(properties = {}) {
        super(properties);
        this._fragmentsByNamespace = {};
    }
    query(ns) {
        return this.queryAll(ns)[0];
    }
    queryAll(ns) {
        return (this._fragmentsByNamespace[ns] || []);
    }
    createChild() {
        var child = new FragmentCollection();
        child.register(this.queryAll('/**'));
        return child;
    }
    register(...fragments) {
        fragments = lodash_1.flattenDeep(fragments);
        this.push(...fragments);
        for (const fragment of fragments) {
            // this happens enough -- make a useful message
            assert(fragment, 'fragment cannot be undefined');
            const ns = fragment.ns;
            const nsParts = ns.split('/');
            for (let i = 0, n = nsParts.length; i <= n; i++) {
                this._registerNS(nsParts.slice(0, i).join('/') + '/**', fragment);
            }
            this._registerNS(fragment.ns, fragment);
        }
    }
    _registerNS(ns, fragment) {
        var collection;
        if (!(collection = this._fragmentsByNamespace[ns])) {
            collection = this._fragmentsByNamespace[ns] = [];
        }
        collection.push(fragment);
        collection = collection.sort((a, b) => (a.priority > b.priority ? -1 : 1));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FragmentCollection;
//# sourceMappingURL=collection.js.map