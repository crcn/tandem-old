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
var memo_1 = require("../memo");
exports.createDataStore = function (records) {
    if (records === void 0) { records = []; }
    return {
        indexedProperties: {},
        records: records.slice()
    };
};
exports.createDSQuery = memo_1.weakMemo(function () {
    var kvPairs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        kvPairs[_i] = arguments[_i];
    }
    var q = {};
    for (var i = 0; i < kvPairs.length; i += 2) {
        q[kvPairs[i]] = kvPairs[i + 1];
    }
    return q;
});
exports.dsIndex = function (ds, propertyName, unique) {
    if (unique === void 0) { unique = true; }
    if (ds.indexedProperties[propertyName]) {
        throw new Error("property " + propertyName + " is already indexed");
    }
    ds = __assign({}, ds, { indexedProperties: __assign({}, ds.indexedProperties, (_a = {}, _a[propertyName] = {
            unique: unique,
            keyIndexPairs: {}
        }, _a)) });
    return exports.dsReindex(ds, propertyName);
    var _a;
};
var getDSFilter = memo_1.weakMemo(function (query, multi) {
    var queryKeys = Object.keys(query);
    if (queryKeys.length === 1) {
        var queryKey_1 = queryKeys[0];
        var queryValue_1 = query[queryKey_1];
        return memo_1.weakMemo(function (ds) {
            var recordIndicesByProperty = ds.indexedProperties[queryKey_1];
            var indices = recordIndicesByProperty && recordIndicesByProperty.keyIndexPairs[queryValue_1];
            // oh god, don't look at it.... 
            return indices != null ? multi ? Array.isArray(indices) ? indices.map(function (i) { return ds.records[i]; }) : [ds.records[indices]] : ds.records[Array.isArray(indices) ? indices[0] : indices] : multi ? ds.records.filter(function (record) { return record[queryKey_1] === queryValue_1; }) : ds.records.find(function (record) { return record[queryKey_1] === queryValue_1; });
        });
    }
    else {
        var tester_1 = createQueryTest(query);
        return memo_1.weakMemo(function (ds) {
            var hasRest = false;
            var foundIndices;
            var restQuery;
            for (var key in query) {
                var recordIndicesByProperty = ds.indexedProperties[key];
                var indices = recordIndicesByProperty && recordIndicesByProperty.keyIndexPairs[query[key]];
                if (indices != null) {
                    if (foundIndices) {
                        var mergedIndices = [];
                        if (Array.isArray(indices)) {
                            for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                                var index = indices_1[_i];
                                if (foundIndices.indexOf(index) !== -1) {
                                    mergedIndices.push(index);
                                }
                            }
                        }
                        else {
                            if (foundIndices.indexOf(indices) !== -1) {
                                mergedIndices.push(indices);
                            }
                        }
                        foundIndices = mergedIndices;
                    }
                    else {
                        foundIndices = Array.isArray(indices) ? indices : [indices];
                    }
                }
                else {
                    if (!restQuery) {
                        restQuery = {};
                    }
                    restQuery[key] = query[key];
                }
            }
            var ret = foundIndices != null ? multi ? foundIndices.map(function (index) { return ds.records[index]; }) : ds.records[foundIndices[0]] : multi ? ds.records.filter(tester_1) : ds.records.find(tester_1);
            if (restQuery) {
                return multi ? ret.filter(createQueryTest(restQuery)) : createQueryTest(restQuery)(ret) ? ret : null;
            }
            else {
                return ret;
            }
        });
    }
});
var dsFilterIndexed = memo_1.weakMemo(function (ds, query, multi) {
    if (multi === void 0) { multi = true; }
    return getDSFilter(query, multi)(ds);
});
var createQueryTest = function (query) {
    return function (record) {
        for (var propertyName in query) {
            if (record[propertyName] !== query[propertyName])
                return false;
        }
        return true;
    };
};
exports.dsReindex = function (ds) {
    var propertyNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        propertyNames[_i - 1] = arguments[_i];
    }
    if (propertyNames.length === 0) {
        propertyNames = Object.keys(ds.indexedProperties);
    }
    var indexedProperties = __assign({}, ds.indexedProperties);
    for (var _a = 0, propertyNames_1 = propertyNames; _a < propertyNames_1.length; _a++) {
        var propertyName = propertyNames_1[_a];
        var unique = indexedProperties[propertyName].unique;
        var keyIndexPairs = {};
        var newIndex = { unique: unique, keyIndexPairs: keyIndexPairs };
        for (var i = 0, n = ds.records.length; i < n; i++) {
            var record = ds.records[i];
            var propertyValue = record[propertyName];
            var index = keyIndexPairs[propertyValue];
            if (index != null) {
                if (unique) {
                    throw new Error("Multiple entries found with unique index \"" + propertyName + "\".");
                }
                if (typeof index === "number") {
                    keyIndexPairs[propertyValue] = [index, i];
                }
                else {
                    keyIndexPairs[propertyValue].push(i);
                }
            }
            else {
                keyIndexPairs[propertyValue] = i;
            }
        }
        indexedProperties[propertyName] = newIndex;
    }
    ds = __assign({}, ds, { indexedProperties: indexedProperties });
    return ds;
};
exports.dsFind = function (ds, query) { return dsFilterIndexed(ds, query, false); };
exports.dsFilter = function (ds, query) { return dsFilterIndexed(ds, query, true); };
exports.dsSplice = function (ds, startIndex, deleteCount) {
    var newRecords = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        newRecords[_i - 3] = arguments[_i];
    }
    var records = ds.records.slice(0, startIndex).concat(newRecords, ds.records.slice(startIndex + deleteCount));
    return exports.dsReindex(__assign({}, ds, { records: records }));
};
exports.dsInsert = function (ds) {
    var newRecords = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        newRecords[_i - 1] = arguments[_i];
    }
    return exports.dsSplice.apply(void 0, [ds, ds.records.length, 0].concat(newRecords));
};
exports.dsRemove = function (ds, query, multi) {
    if (multi === void 0) { multi = true; }
    var indicesToRemove = exports.dsFilter(ds, query).map(function (record) { return ds.records.indexOf(record); });
    if (!multi && indicesToRemove.length) {
        indicesToRemove = [indicesToRemove[0]];
    }
    var records = ds.records.slice();
    for (var i = indicesToRemove.length; i--;) {
        records.splice(indicesToRemove[i], 1);
    }
    return exports.dsReindex(__assign({}, ds, { records: records }));
};
exports.dsRemoveOne = function (ds, query, multi) {
    if (multi === void 0) { multi = true; }
    return exports.dsRemove(ds, query, false);
};
exports.dsUpdate = function (ds, query, properties, _a) {
    var _b = _a === void 0 ? { multi: true, upsert: false } : _a, multi = _b.multi, upsert = _b.upsert;
    var indicesToUpdate = exports.dsFilter(ds, query).map(function (record) { return ds.records.indexOf(record); });
    if (indicesToUpdate.length) {
        if (!multi)
            indicesToUpdate = [indicesToUpdate[0]];
    }
    else if (upsert) {
        return exports.dsInsert(ds, properties);
    }
    var records = ds.records.slice();
    for (var i = indicesToUpdate.length; i--;) {
        var index = indicesToUpdate[i];
        records.splice(index, 1, __assign({}, records[index], properties));
    }
    return exports.dsReindex(__assign({}, ds, { records: records }));
};
exports.dsUpdateOne = function (ds, query, properties, options) {
    if (options === void 0) { options = { upsert: false }; }
    return exports.dsUpdate(ds, query, properties, __assign({}, options, { multi: false }));
};
//# sourceMappingURL=index.js.map