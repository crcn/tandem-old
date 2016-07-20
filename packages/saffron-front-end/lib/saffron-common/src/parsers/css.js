"use strict";
const sift = require('sift');
const css_1 = require('../tokenizers/css');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    parse(tokens, expressionFactory) {
        if (typeof tokens === 'string') {
            tokens = css_1.default.tokenize(tokens);
        }
        if (!expressionFactory) {
            expressionFactory = {
                create(type, props) {
                    return Object.assign({ type });
                }
            };
        }
        // get tokens - remove all whitespace
        tokens = tokens.filter(function (token) {
            return !/^[\s\r\n\t]+$/.test(token.value);
        });
        function nextToken() {
            return tokens.shift();
        }
        function peekToken(offset = 0) {
            return tokens[offset];
        }
        function peekTokenType(offset = 0) {
            var token = peekToken(offset);
            return token ? token.type : void 0;
        }
        function root() {
            return commaList();
        }
        function commaList() {
            return list(function (v) {
                return v === ',' ? nextToken() : v === ')' ? false : true;
            }, spaceList);
        }
        function spaceList() {
            return list(function (v) {
                return !/[,|;\)]/.test(v);
            }, operable);
        }
        function list(eatNext, createExpression) {
            var items = [];
            while (!eof()) {
                if (!eatNext(peekToken().value)) {
                    break;
                }
                items.push(createExpression());
            }
            return items.length > 1 ? items : items[0];
        }
        function operable() {
            return additive();
        }
        function operation(createLeft, createRight, operatorSearch) {
            var left;
            var right;
            var operator2;
            var rleft;
            var op;
            left = createLeft();
            operator2 = queryNextTokenValue(operatorSearch);
            if (!operator2)
                return left;
            right = createRight();
            op = expressionFactory.create('operation', {
                left,
                operator: operator2.value,
                right,
            });
            // TODO - this is kind of nast - swapping around the AST
            // like this - primarily since custom expressions are created
            // *before* this happens. One possibly fix for this might be to create the AST first,
            // then instantiate the custom expressions after that.
            if (!right.left)
                return op;
            rleft = right.left;
            right.left = op;
            op.right = rleft;
            return right;
        }
        function additive() {
            return operation(multiplicative, additive, /\+|\-/);
        }
        function queryNextTokenValue(query) {
            var token = peekToken();
            if (sift({ value: query })(token))
                return nextToken();
        }
        function multiplicative() {
            return operation(expression, multiplicative, /\/|\*/);
        }
        function expression() {
            var token = peekToken();
            switch (token.type) {
                case 'number': return number();
                case 'operator': return operator();
                case 'reference': return reference();
                default: return tokenExpression();
            }
        }
        function operator() {
            var token = peekToken();
            if (token.value === '-' && peekTokenType(1) != void 0) {
                nextToken();
                return expressionFactory.create('neg', {
                    value: !eof() ? expression() : void 0,
                });
            }
            return tokenExpression();
        }
        function tokenExpression() {
            var token = nextToken();
            return expressionFactory.create(token.type, {
                value: token.value,
            });
        }
        function reference() {
            var reference2 = nextToken();
            var nToken = peekToken();
            if (nToken && nToken.value === '(') {
                return expressionFactory.create('call', {
                    name: reference2.value,
                    params: params(),
                });
            }
            return expressionFactory.create(reference2.type, {
                path: reference2.value.split('.'),
            });
        }
        function params() {
            return toArray(list(function () {
                return nextToken().value !== ')';
            }, spaceList));
        }
        function toArray(v) {
            return Array.isArray(v) ? v : v == void 0 ? [] : [v];
        }
        function eof() {
            return tokens.length === 0;
        }
        function number() {
            const number2 = nextToken();
            let unit;
            if (hasNextToken('unit')) {
                unit = nextToken().value;
            }
            else if (hasNextToken('reference')) {
                console.error('unit %s is not recognized as a unit. Cannot be used!', nextToken().value);
            }
            return expressionFactory.create('length', {
                value: number2.value,
                unit: unit || 'px',
            });
        }
        function hasNextToken(type2) {
            var nt = peekToken();
            return nt && nt.type === type2;
        }
        return root();
    },
};
//# sourceMappingURL=css.js.map