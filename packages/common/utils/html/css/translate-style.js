import sift from 'sift';
import CSSTokenizer from 'common/tokenizers/css';
import CSSParser from 'common/parsers/css';

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
  return CSSParser.parse(CSSTokenizer.tokenize(String(length)), astFactory).solveX({});
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
    var ast = CSSParser.parse(tokens, astFactory);

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
