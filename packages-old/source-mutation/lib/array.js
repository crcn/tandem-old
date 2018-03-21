"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARRAY_DIFF = "ARRAY_DIFF";
exports.ARRAY_INSERT = "ARRAY_INSERT";
exports.ARRAY_UPDATE = "ARRAY_UPDATE";
exports.ARRAY_DELETE = "ARRAY_DELETE";
exports.createArrayInsertMutation = function (index, value) { return ({
    type: exports.ARRAY_INSERT,
    index: index,
    value: value,
}); };
exports.createArrayUpdateMutation = function (originalOldIndex, patchedOldIndex, newValue, index) { return ({
    type: exports.ARRAY_UPDATE,
    index: index,
    newValue: newValue,
    originalOldIndex: originalOldIndex,
    patchedOldIndex: patchedOldIndex,
}); };
exports.createArrayDeleteMutation = function (value, index) { return ({
    type: exports.ARRAY_DELETE,
    value: value,
    index: index
}); };
exports.createArrayMutation = function (mutations) { return ({
    type: exports.ARRAY_DIFF,
    mutations: mutations
}); };
function diffArray(oldArray, newArray, countDiffs) {
    // model used to figure out the proper mutation indices
    var model = [].concat(oldArray);
    // remaining old values to be matched with new values. Remainders get deleted.
    var oldPool = [].concat(oldArray);
    // remaining new values. Remainders get inserted.
    var newPool = [].concat(newArray);
    var mutations = [];
    var matches = [];
    for (var i = 0, n = oldPool.length; i < n; i++) {
        var oldValue = oldPool[i];
        var bestNewValue = void 0;
        var fewestDiffCount = Infinity;
        // there may be multiple matches, so look for the best one
        for (var j = 0, n2 = newPool.length; j < n2; j++) {
            var newValue = newPool[j];
            // -1 = no match, 0 = no change, > 0 = num diffs
            var diffCount = countDiffs(oldValue, newValue);
            if (~diffCount && diffCount < fewestDiffCount) {
                bestNewValue = newValue;
                fewestDiffCount = diffCount;
            }
            // 0 = exact match, so break here.
            if (fewestDiffCount === 0)
                break;
        }
        // subtract matches from both old & new pools and store
        // them for later use
        if (bestNewValue != null) {
            oldPool.splice(i--, 1);
            n--;
            newPool.splice(newPool.indexOf(bestNewValue), 1);
            // need to manually set array indice here to ensure that the order
            // of operations is correct when mutating the target array.
            matches[newArray.indexOf(bestNewValue)] = [oldValue, bestNewValue];
        }
    }
    for (var i = oldPool.length; i--;) {
        var oldValue = oldPool[i];
        var index = oldArray.indexOf(oldValue);
        mutations.push(exports.createArrayDeleteMutation(oldValue, index));
        model.splice(index, 1);
    }
    // sneak the inserts into the matches so that they're
    // ordered propertly along with the updates - particularly moves.
    for (var i = 0, n = newPool.length; i < n; i++) {
        var newValue = newPool[i];
        var index = newArray.indexOf(newValue);
        matches[index] = [undefined, newValue];
    }
    // apply updates last using indicies from the old array model. This ensures
    // that mutations are properly applied to whatever target array.
    for (var i = 0, n = matches.length; i < n; i++) {
        var match = matches[i];
        // there will be empty values since we're manually setting indices on the array above
        if (match == null)
            continue;
        var _a = matches[i], oldValue = _a[0], newValue = _a[1];
        var newIndex = i;
        // insert
        if (oldValue == null) {
            mutations.push(exports.createArrayInsertMutation(newIndex, newValue));
            model.splice(newIndex, 0, newValue);
            // updated
        }
        else {
            var oldIndex = model.indexOf(oldValue);
            mutations.push(exports.createArrayUpdateMutation(oldArray.indexOf(oldValue), oldIndex, newValue, newIndex));
            if (oldIndex !== newIndex) {
                model.splice(oldIndex, 1);
                model.splice(newIndex, 0, oldValue);
            }
        }
    }
    return exports.createArrayMutation(mutations);
}
exports.diffArray = diffArray;
exports.eachArrayValueMutation = function (diff, handlers) {
    diff.mutations.forEach(function (mutation) {
        switch (mutation.type) {
            case exports.ARRAY_INSERT: return handlers.insert(mutation);
            case exports.ARRAY_DELETE: return handlers.delete(mutation);
            case exports.ARRAY_UPDATE: return handlers.update(mutation);
        }
    });
};
function patchArray(target, diff, mapUpdate, mapInsert) {
    if (mapUpdate === void 0) { mapUpdate = function (a, b) { return b; }; }
    if (mapInsert === void 0) { mapInsert = function (b) { return b; }; }
    var newTarget = target.slice();
    exports.eachArrayValueMutation(diff, {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            newTarget.splice(index, 0, mapInsert(value));
        },
        delete: function (_a) {
            var index = _a.index;
            newTarget.splice(index, 1);
        },
        update: function (_a) {
            var patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
            var oldValue = newTarget[patchedOldIndex];
            var patchedValue = mapUpdate(oldValue, newValue);
            if (patchedValue !== oldValue || patchedOldIndex !== index) {
                if (patchedOldIndex !== index) {
                    newTarget.splice(patchedOldIndex, 1);
                }
                newTarget.splice(index, 0, patchedValue);
            }
        }
    });
    return newTarget;
}
exports.patchArray = patchArray;
//# sourceMappingURL=array.js.map