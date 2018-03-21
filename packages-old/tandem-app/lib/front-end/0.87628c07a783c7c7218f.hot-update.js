webpackHotUpdate(0,{

/***/ "../slim-dom/lib/utils.js":
/***/ (function(module, exports, __webpack_require__) {

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
var state_1 = __webpack_require__("../slim-dom/lib/state.js");
var crc32 = __webpack_require__("./node_modules/crc32/lib/crc32.js");
var previousPurgeTime = 0;
var DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 5;
var DEFAULT_ANCHOR = {};
function weakMemo(func, mapMemo) {
    if (mapMemo === void 0) { mapMemo = (function (value) { return value; }); }
    var count = 1;
    var memoKey = Symbol();
    var hashKey = Symbol();
    return function () {
        if (previousPurgeTime && Date.now() - DUMP_DEFAULT_ANCHOR_INTERVAL > previousPurgeTime) {
            previousPurgeTime = Date.now();
            DEFAULT_ANCHOR = {};
        }
        var hash = "";
        var anchor = DEFAULT_ANCHOR;
        for (var i = 0, n = arguments.length; i < n; i++) {
            var arg = arguments[i];
            var hashPart = void 0;
            if (arg && typeof arg === "object") {
                anchor = arg;
                hashPart = arg[hashKey] && arg[hashKey].self === arg ? arg[hashKey].value : (arg[hashKey] = { self: arg, value: ":" + (count++) }).value;
            }
            else {
                hashPart = ":" + arg;
            }
            hash += hashPart;
        }
        if (!anchor[memoKey] || anchor[memoKey].self !== anchor)
            anchor[memoKey] = { self: anchor };
        return mapMemo(anchor[memoKey].hasOwnProperty(hash) ? anchor[memoKey][hash] : anchor[memoKey][hash] = func.apply(this, arguments));
    };
}
exports.weakMemo = weakMemo;
;
exports.pushChildNode = function (parent, child) { return (__assign({}, parent, { childNodes: parent.childNodes.concat([
        child
    ]) })); };
exports.removeChildNodeAt = function (parent, index) { return (__assign({}, parent, { childNodes: parent.childNodes.slice(0, index).concat(parent.childNodes.slice(index + 1)) })); };
exports.insertChildNode = function (parent, child, index) {
    if (index === void 0) { index = Number.MAX_SAFE_INTEGER; }
    return (__assign({}, parent, { childNodes: parent.childNodes.slice(0, index).concat([
            child
        ], parent.childNodes.slice(index)) }));
};
exports.stringifyNode = weakMemo(function (node) {
    switch (node.type) {
        case state_1.SlimVMObjectType.TEXT: {
            var text = node;
            return text.value;
        }
        case state_1.SlimVMObjectType.ELEMENT: {
            var el = node;
            var buffer = "<" + el.tagName + " ";
            for (var i = 0, length_1 = el.attributes.length; i < length_1; i++) {
                var attr = el.attributes[i];
                buffer += " " + attr.name + "=" + JSON.stringify(attr.value);
            }
            buffer += ">";
            for (var i = 0, length_2 = el.childNodes.length; i < length_2; i++) {
                buffer += exports.stringifyNode(el.childNodes[i]);
            }
            buffer += "</" + el.tagName + ">";
            return buffer;
        }
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT:
        case state_1.SlimVMObjectType.DOCUMENT: {
            var el = node;
            var buffer = "";
            for (var i = 0, length_3 = el.childNodes.length; i < length_3; i++) {
                buffer += exports.stringifyNode(el.childNodes[i]);
            }
            return buffer;
        }
    }
});
exports.getAttribute = function (name, element) { return element.attributes.find(function (attribute) { return attribute.name === name; }); };
exports.hasAttribute = function (name, element) {
    return exports.getAttribute(name, element) != null;
};
exports.getAttributeValue = function (name, element) {
    var attribute = exports.getAttribute(name, element);
    return attribute && attribute.value;
};
exports.getNodeAncestors = weakMemo(function (value, root) {
    var objects = exports.flattenObjects(root);
    var current = objects[objects[value.id].parentId];
    var ancestors = [];
    while (current) {
        ancestors.push(current.value);
        current = objects[current.parentId];
    }
    return ancestors;
});
exports.getNodePath = weakMemo(function (value, root) {
    var objects = exports.flattenObjects(root);
    var current = objects[value.id];
    var path = [];
    while (current && current.parentId) {
        var parentInfo = objects[current.parentId];
        // TODO - check if css rules
        if (parentInfo.value.shadow === current.value) {
            path.unshift("shadow");
        }
        else {
            path.unshift(parentInfo.value.childNodes.indexOf(current.value));
        }
        current = parentInfo;
    }
    return path;
});
exports.getNestedObjectById = weakMemo(function (id, root) {
    var ref = flattenChildNodes(root);
    return ref[id] && ref[id].value;
});
exports.flattenObjects = weakMemo(function (value, parentId) {
    switch (value.type) {
        case state_1.SlimVMObjectType.TEXT: {
            var node = value;
            return _a = {},
                _a[node.id] = {
                    parentId: parentId,
                    value: value
                },
                _a;
        }
        case state_1.SlimVMObjectType.ELEMENT: {
            var element = value;
            var base = (_b = {},
                _b[element.id] = {
                    parentId: parentId,
                    value: value
                },
                _b);
            var style = exports.getAttributeValue("style", element);
            if (style && typeof style === "object") {
                base[style.id] = {
                    parentId: element.id,
                    value: style,
                };
            }
            if (element.tagName === "style") {
                Object.assign(base, flattenCSSObjects(element.sheet, element.id));
            }
            else {
                if (element.shadow) {
                    Object.assign(base, exports.flattenObjects(element.shadow, element.id));
                }
                Object.assign(base, flattenChildNodes(element));
            }
            return base;
        }
        case state_1.SlimVMObjectType.DOCUMENT:
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: {
            return __assign((_c = {}, _c[value.id] = { parentId: parentId, value: value }, _c), flattenChildNodes(value));
        }
    }
    var _a, _b, _c;
});
var flattenCSSObjects = weakMemo(function (value, parentId) {
    switch (value.type) {
        case state_1.SlimVMObjectType.MEDIA_RULE:
        case state_1.SlimVMObjectType.STYLE_SHEET: {
            var grouping = value;
            var base = (_a = {},
                _a[grouping.id] = {
                    parentId: parentId,
                    value: value,
                },
                _a);
            Object.assign(base, flattenCSSRules(grouping));
            return base;
        }
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var rule = value;
            return _b = {},
                _b[rule.id] = {
                    parentId: parentId,
                    value: value,
                },
                _b[rule.style.id] = {
                    parentId: rule.id,
                    value: rule.style
                },
                _b;
        }
    }
    var _a, _b;
});
var flattenChildNodes = weakMemo(function (target) {
    var objects = {};
    for (var i = 0, length_4 = target.childNodes.length; i < length_4; i++) {
        Object.assign(objects, exports.flattenObjects(target.childNodes[i], target.id));
    }
    return objects;
});
var flattenCSSRules = weakMemo(function (target) {
    var objects = {};
    for (var i = 0, length_5 = target.rules.length; i < length_5; i++) {
        Object.assign(objects, flattenCSSObjects(target.rules[i], target.id));
    }
    return objects;
});
exports.getDocumentChecksum = weakMemo(function (document) { return crc32(exports.stringifyNode(document)); });
exports.replaceNestedChild = function (current, path, child, index) {
    if (index === void 0) { index = 0; }
    var part = path[index];
    if (index === path.length) {
        return child;
    }
    if (part === "shadow") {
        return __assign({}, current, { shadow: exports.replaceNestedChild(current.shadow, path, child, index + 1) });
    }
    return __assign({}, current, { childNodes: current.childNodes.slice(0, part).concat([
            exports.replaceNestedChild(current.childNodes[part], path, child, index + 1)
        ], current.childNodes.slice(part + 1)) });
};
exports.setTextNodeValue = function (target, newValue) { return (__assign({}, target, { value: newValue })); };
exports.setElementAttribute = function (target, name, value) {
    var attributes = [];
    var found;
    for (var i = 0, length_6 = target.attributes.length; i < length_6; i++) {
        var attribute = target.attributes[i];
        if (attribute.name === name) {
            found = true;
            if (value) {
                attributes.push({ name: name, value: value });
            }
        }
        else {
            attributes.push(attribute);
        }
    }
    if (!found) {
        attributes.push({ name: name, value: value });
    }
    return __assign({}, target, { attributes: attributes });
};
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/crc32/lib/crc32.js":
/***/ (function(module, exports) {

(function () {
	'use strict';

	var table = [],
		poly = 0xEDB88320; // reverse polynomial

	// build the table
	function makeTable() {
		var c, n, k;

		for (n = 0; n < 256; n += 1) {
			c = n;
			for (k = 0; k < 8; k += 1) {
				if (c & 1) {
					c = poly ^ (c >>> 1);
				} else {
					c = c >>> 1;
				}
			}
			table[n] = c >>> 0;
		}
	}

	function strToArr(str) {
		// sweet hack to turn string into a 'byte' array
		return Array.prototype.map.call(str, function (c) {
			return c.charCodeAt(0);
		});
	}

	/*
	 * Compute CRC of array directly.
	 *
	 * This is slower for repeated calls, so append mode is not supported.
	 */
	function crcDirect(arr) {
		var crc = -1, // initial contents of LFBSR
			i, j, l, temp;

		for (i = 0, l = arr.length; i < l; i += 1) {
			temp = (crc ^ arr[i]) & 0xff;

			// read 8 bits one at a time
			for (j = 0; j < 8; j += 1) {
				if ((temp & 1) === 1) {
					temp = (temp >>> 1) ^ poly;
				} else {
					temp = (temp >>> 1);
				}
			}
			crc = (crc >>> 8) ^ temp;
		}

		// flip bits
		return crc ^ -1;
	}

	/*
	 * Compute CRC with the help of a pre-calculated table.
	 *
	 * This supports append mode, if the second parameter is set.
	 */
	function crcTable(arr, append) {
		var crc, i, l;

		// if we're in append mode, don't reset crc
		// if arr is null or undefined, reset table and return
		if (typeof crcTable.crc === 'undefined' || !append || !arr) {
			crcTable.crc = 0 ^ -1;

			if (!arr) {
				return;
			}
		}

		// store in temp variable for minor speed gain
		crc = crcTable.crc;

		for (i = 0, l = arr.length; i < l; i += 1) {
			crc = (crc >>> 8) ^ table[(crc ^ arr[i]) & 0xff];
		}

		crcTable.crc = crc;

		return crc ^ -1;
	}

	// build the table
	// this isn't that costly, and most uses will be for table assisted mode
	makeTable();

	module.exports = function (val, direct) {
		var val = (typeof val === 'string') ? strToArr(val) : val,
			ret = direct ? crcDirect(val) : crcTable(val);

		// convert to 2's complement hex
		return (ret >>> 0).toString(16);
	};
	module.exports.direct = crcDirect;
	module.exports.table = crcTable;
}());


/***/ })

})