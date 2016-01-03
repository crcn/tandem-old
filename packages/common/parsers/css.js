import CSSTokenizer from 'common/tokenizers/css';

export default {
  parse(tokens, expressionFactory) {

    if (typeof tokens === 'string') {
      tokens = CSSTokenizer.tokenize(tokens);
    }

    if (!expressionFactory) {
      expressionFactory = {
        create: function(type, props) {
          return { type: type, ...props };
        }
      };
    }

    // get tokens - remove all whitespace
    tokens = tokens.filter(function(token) {
      return !/^[\s\r\n\t]+$/.test(token.value);
    });

    function nextToken() {
      return tokens.shift();
    }

    function peekToken() {
      return tokens[0];
    }

    function root() {
      return commaList();
    }

    function commaList() {
      return list(function(v) {
        return v === ',' ? nextToken() : v === ')' ? false : true;
      }, spaceList);
    }

    function spaceList() {
      return list(function(v) {
        return !/[,|;\)]/.test(v);
      }, operable);
    }

    function list(eatNext, createExpression) {
      var items = [];
      while(!eof()) {
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
      var left     = createLeft();
      var operator = queryNextTokenValue(operatorSearch);
      if (!operator) return left;
      var right    = createRight();

      var op = expressionFactory.create('operation', {
        left: left,
        operator: operator.value,
        right: right
      });

      // TODO - this is kind of nast - swapping around the AST
      // like this - primarily since custom expressions are created *before* this happens. One possibly fix for this might be to create the AST first, then instantiate the custom expressions after that.

      if (!right.left) return op;

      var rleft  = right.left;
      right.left = op;
      op.right   = rleft;
      return right;
    }

    function additive() {
      return operation(multiplicative, additive, /\+|\-/);
    }

    function type(type) {
      var token = peekToken();
      if (token.type === type) {
        return nextToken();
      }
    }

    function queryNextTokenValue(query) {
      var token = peekToken();
      if (sift({ value: query })(token)) return nextToken();
    }

    function multiplicative() {
      return operation(expression, multiplicative, /\/|\*/);
    }

    function expression() {
      var token = peekToken();
      switch(token.type) {
        case 'number'    : return number();
        case 'operator'  : return operator();
        case 'reference' : return reference();
        default          : return tokenExpression();
      }
    }

    function operator() {
      var token = peekToken();

      if (token.value === '-') {
        nextToken();
        return expressionFactory.create('neg', {
          value: expression()
        });
      }

      return tokenExpression();
    }

    function tokenExpression() {
      var token = nextToken();
      return expressionFactory.create(token.type, {
        value: token.value
      });
    }

    function reference() {
      var reference = nextToken();
      var nToken    = peekToken();

      if (nToken && nToken.value === '(') {
        return expressionFactory.create('call', {
          name   : reference.value,
          params : params()
        })
      } else {
        return expressionFactory.create(reference.type, {
          path: reference.value.split('.')
        });
      }
    }

    function params() {
      return toArray(list(function(v) {
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
      var number = nextToken();
      var unit;

      if (hasNextToken('unit')) {
        unit = nextToken().value;

      // value is given but not recoginized as a unit. SHow a warning
      } else if (hasNextToken('reference')) {
        console.warn('unit %s is not recognized as a unit. Cannot be used!', nextToken().value);
      }

      return expressionFactory.create('length', {
        value : number.value,
        unit  : unit || 'px'
      })
    }

    function hasNextToken(type) {
      var nt = peekToken();
      return nt && nt.type === type;
    }

    return root();
  }
}
