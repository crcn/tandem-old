import sift from 'sift';
import CSSTokenizer from 'common/tokenizers/css';

var div = document.createElement('div')
document.body.appendChild(div);
div.style.position = 'absolute';

var conv = {};

const MAX_DECIMALS = 3;

var units = [
  'cm',
  'mm',
  'in',
  'px',
  'pt',
  'pc',
  'em'
];

units.forEach(function(unit) {

  // some big number so that we get accurate, rounded conversions
  div.style.left = 1000 + unit;
  conv[unit] = (Math.round(div.getBoundingClientRect().left) / 1000).toFixed(MAX_DECIMALS);
});

function findRelativeElement(element) {

  var position = String(window.getComputedStyle(element).position);
  var relativeParent;

  if (/undefined|static|relative/.test(position) || position === '') {
    relativeParent = element.parentNode; // || document.body;
  } else if (/fixed/.test(position)) {
    relativeParent = document.body;
  } else if (/absolute/.test(position)) {
    relativeParent = element.parentNode;
    while(relativeParent && (!relativeParent.style || !/absolute|fixed|relative/.test(window.getComputedStyle(relativeParent).position))) {
      relativeParent = relativeParent.parentNode;
    }
  }

  return relativeParent || document.body;
}

// TODO - possibly move this to another directory
function parseLength(tokens, expressionFactory) {

  if (!expressionFactory) {
    expressionFactory = {
      create: function(type, props) {
        return { type: type, ...props };
      }
    };
  }

  // get tokens - remove all whitespace
  tokens = tokens.filter(function(token) {
    return !/^[\s\r\n\t]$/.test(token.value);
  });

  function nextToken() {
    return tokens.shift();
  }

  function peekToken() {
    return tokens[0];
  }

  function root() {
    return operable();
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
      case 'number': return length();
      case 'reference': return reference();
    }
  }

  function eat() {
    nextToken();
    return expression();
  }

  function reference() {
    var reference = nextToken();
    var token = peekToken();
    if (token.value === '(') {
      return expressionFactory.create('call', {
        name   : reference.value,
        params : params()
      })
    }
  }

  function params() {
    nextToken(); // eat (
    var current;
    var params = [];

    while(!eof()) {
      if (peekToken().value === ')') {
        nextToken();
        break;
      }
      params.push(operable());
      nextToken(); // eat param or space
    }

    return params;
  }

  function eof() {
    return tokens.length === 0;
  }

  function length() {
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

function translateToScaleProperty(property) {
  if (/left|right|width/.test(property)) return 'width';
  if (/top|bottom|height/.test(property)) return 'height';
}

function getInnerElementBounds(element) {
  var padding = element.style.paddingRight;

  var left   = translateLengthToInteger(element.style.paddingLeft);
  var right  = translateLengthToInteger(element.style.paddingRight);
  var top    = translateLengthToInteger(element.style.paddingTop);
  var bottom = translateLengthToInteger(element.style.paddingBottom);

  var bounds = element.getBoundingClientRect();

  // console.log(bounds.right - bounds.left, element.style.width);
  return {
    left   : left,
    right  : right,
    top    : top,
    bottom : bottom,
    width  : (bounds.right - bounds.left) - (right + left),
    height : (bounds.bottom - bounds.top) - (bottom + top)
  };
}

function translateLengthToInteger(length) {
  if (length === '') return 0;
  return parseLength(CSSTokenizer.tokenize(String(length)), astFactory).solveX({});
}

var astFactory = {
  create(type, props) {
    return this[type] ? this[type](props) : { type: type, ...props };
  },
  call(props) {
    return {
      solveX(info) {
        for (var i = 0; i < props.params.length; i++) {
          var ret =  props.params[i].solveX(info);
          if (ret != void 0) return ret;
        }
      }
    }
  },
  length(props) {
    switch(props.unit) {
      case '%': return this.percLength(props);
      default: return this.measuredLength(props);
    }
  },
  percLength(props) {
    return {
      solveX(info) {
        var reduce = this.prepare(info);
        return typeof reduce === 'function' ? reduce(info.y) : reduce;
      },
      prepare({ relativeElement, property }) {

        var relativeParent = findRelativeElement(relativeElement);
        var bounds         = getInnerElementBounds(relativeParent);
        var scaleProperty  = translateToScaleProperty(property);

        return props.value === 'x' ? function(y) {
          return (y / bounds[scaleProperty]) * 100;
        } : 1;
      }
    }
  },
  measuredLength(props) {
    return {
      solveX(info) {
        var reduce = this.prepare(info);
        return typeof reduce === 'function' ? reduce(info.y) : reduce;
      },
      prepare() {
        // console.log(Number(props.value), conv[props.unit]);
        return props.value === 'x' ? function(y) {
          return y / conv[props.unit];
        } : Number(props.value) * Number(conv[props.unit]);
      }
    }
  },
  operation(props) {
    var op = props.operator;
    return {
      left: props.left,
      right: props.right,
      solveX(info) {
        var reduce = this.prepare(info);
        return typeof reduce === 'function' ? reduce(info.y) : reduce;
      },
      prepare(info) {
        var leftReduce  = this.left.prepare(info);
        var rightReduce = this.right.prepare(info);

        // if the returned type is a function, then X
        // is somewhere here
        if (typeof leftReduce === 'function') {

          // something like x - 5 = 500. (502)
          if (op === '-') {
            return function(y) {
              return leftReduce(y + rightReduce);
            };
          // x + 5 = 100
          } else if (op === '+') {
            return function(y) {
              return leftReduce(y - rightReduce);
            };
          // x / 5 = 10
          } else if (op === '/') {
            return function(y) {
              return leftReduce(y * rightReduce);
            };
          // x * 5 = 10
          } else if (op === '*') {
            return function(y) {
              return leftReduce(y / rightReduce);
            };
          }
        }

        // TODO - need to check when rightReduce
        // is a function here

        // left & right are numbers
        if (op === '/') {
          return leftReduce / rightReduce;
        } else if (op === '*') {
          return leftReduce * rightReduce;
        } else if (op === '-') {
          return leftReduce - rightReduce;
        } else if (op === '+') {
          return leftReduce + rightReduce;
        }
      }
    };
  }
};

function translate(fromStyle, toStyle, element) {

  if (typeof fromStyle === 'string') {

    if (element) {
      console.warn('CSS length conversion from %s to %s should be wrapped in {width:fromStyle} and { width: toStyle } for an accurate measurement.', fromStyle, toStyle);
    }

    // just the unit present. Give a 0.
    if (!/\d+/.test(toStyle)) toStyle = 0 + toStyle;

    return translate({ left: fromStyle }, { left: toStyle }, element).left;
  }

  var translatedStyle = {};

  for (var property in fromStyle) {
    translatedStyle[property] = translateDeclaration(property, fromStyle[property], toStyle[property], element);
  }

  function translateDeclaration(property, fromValue, toValue, element) {
    if (!toValue) return fromValue;

    // fromValue could be a length. Need to normalize it so that
    // it can be converted into the toValue
    fromValue = translateLengthToInteger(fromValue);

    // first tokenize the toValue up
    var tokens = CSSTokenizer.tokenize(toValue);

    // then replace the left-most length with X which be used
    // as the conversion value. Later on this might be customizable
    var firstNumber = tokens.find(function(token) {
      return token.type === 'number';
    });

    // change with X
    if (firstNumber) {
      firstNumber.value = 'x';
    }

    // parse into the AST
    var ast = parseLength(tokens, astFactory);

    // take the fromValue and solveX - thus converting fromValue -> value
    firstNumber.value = Number(ast.solveX({
      y: fromValue,
      relativeElement: element,
      property: property
    }).toFixed(MAX_DECIMALS));

    return tokens.map(function(token) {
      return token.value;
    }).join('');
  }

  return translatedStyle;
}

export default translate;
