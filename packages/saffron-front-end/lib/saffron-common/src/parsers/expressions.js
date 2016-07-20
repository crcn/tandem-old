/**
 * Generic
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class BaseExpression {
    constructor(ns) {
        this.ns = ns;
    }
    createEntity(properties) {
        const fragment = properties.fragments.query(`entities/${this.ns}`);
        if (!fragment) {
            throw new Error(`entity fragment "${this.ns}" does not exist`);
        }
        return fragment.create(Object.assign({}, properties, {
            expression: this
        }));
    }
    load(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            var entity = this.createEntity(properties);
            yield entity.load(properties);
            return entity;
        });
    }
}
exports.BaseExpression = BaseExpression;
class RootExpression extends BaseExpression {
    constructor(childNodes) {
        super('root');
        this.childNodes = childNodes;
    }
}
exports.RootExpression = RootExpression;
/**
 * HTML
 */
class HTMLElementExpression extends BaseExpression {
    constructor(nodeName, attributes, childNodes) {
        super('htmlElement');
        this.nodeName = nodeName;
        this.attributes = attributes;
        this.childNodes = childNodes;
    }
}
exports.HTMLElementExpression = HTMLElementExpression;
class HTMLAttributeExpression extends BaseExpression {
    constructor(key, value) {
        super('htmlAttribute');
        this.key = key;
        this.value = value;
    }
}
exports.HTMLAttributeExpression = HTMLAttributeExpression;
class HTMLTextExpression extends BaseExpression {
    constructor(nodeValue) {
        super('htmlText');
        this.nodeValue = nodeValue;
    }
}
exports.HTMLTextExpression = HTMLTextExpression;
class HTMLCommentExpression extends BaseExpression {
    constructor(nodeValue) {
        super('htmlComment');
        this.nodeValue = nodeValue;
    }
}
exports.HTMLCommentExpression = HTMLCommentExpression;
class HTMLScriptExpression extends BaseExpression {
    constructor(value) {
        super('htmlScript');
        this.value = value;
    }
}
exports.HTMLScriptExpression = HTMLScriptExpression;
class HTMLBlockExpression extends BaseExpression {
    constructor(script) {
        super('htmlBlock');
        this.script = script;
    }
}
exports.HTMLBlockExpression = HTMLBlockExpression;
/**
 * CSS
 */
class CSSStyleExpression extends BaseExpression {
    constructor(declarations) {
        super('cssStyle');
        this.declarations = declarations;
    }
}
exports.CSSStyleExpression = CSSStyleExpression;
class CSSStyleDeclaration extends BaseExpression {
    constructor(key, value) {
        super('cssStyleDeclaration');
        this.key = key;
        this.value = value;
    }
}
exports.CSSStyleDeclaration = CSSStyleDeclaration;
class CSSLiteralExpression extends BaseExpression {
    constructor(value) {
        super('cssLiteral');
        this.value = value;
    }
}
exports.CSSLiteralExpression = CSSLiteralExpression;
class CSSFunctionCallExpression extends BaseExpression {
    constructor(name, parameters) {
        super('cssFunctionCall');
        this.name = name;
        this.parameters = parameters;
    }
}
exports.CSSFunctionCallExpression = CSSFunctionCallExpression;
class CSSListValueExpression extends BaseExpression {
    constructor(values) {
        super('cssListValue');
        this.values = values;
    }
}
exports.CSSListValueExpression = CSSListValueExpression;
/**
 *  JavaScript
 */
class StringExpression extends BaseExpression {
    constructor(value) {
        super('string');
        this.value = value;
    }
}
exports.StringExpression = StringExpression;
class ReferenceExpression extends BaseExpression {
    constructor(path) {
        super('reference');
        this.path = path;
    }
}
exports.ReferenceExpression = ReferenceExpression;
class FunctionCallExpression extends BaseExpression {
    constructor(reference, parameters) {
        super('functionCall');
        this.reference = reference;
        this.parameters = parameters;
    }
}
exports.FunctionCallExpression = FunctionCallExpression;
class OperationExpression extends BaseExpression {
    constructor(operator, left, right) {
        super('operation');
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}
exports.OperationExpression = OperationExpression;
class LiteralExpression extends BaseExpression {
    constructor(value) {
        super('literal');
        this.value = value;
    }
}
exports.LiteralExpression = LiteralExpression;
class NegativeExpression extends BaseExpression {
    constructor(value) {
        super('negative');
        this.value = value;
    }
}
exports.NegativeExpression = NegativeExpression;
class NotExpression extends BaseExpression {
    constructor(value) {
        super('not');
        this.value = value;
    }
}
exports.NotExpression = NotExpression;
class TernaryExpression extends BaseExpression {
    constructor(condition, left, right) {
        super('ternary');
        this.condition = condition;
        this.left = left;
        this.right = right;
    }
}
exports.TernaryExpression = TernaryExpression;
class HashExpression extends BaseExpression {
    constructor(values) {
        super('hash');
        this.values = values;
    }
}
exports.HashExpression = HashExpression;
//# sourceMappingURL=expressions.js.map