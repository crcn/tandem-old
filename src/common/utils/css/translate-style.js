
import CSSParser from 'common/parsers/css';
import CSSTokenizer from 'common/tokenizers/css';

var div = document.createElement('div');
document.body.appendChild(div);
div.style.position = 'absolute';

const conv = {};
const MAX_DECIMALS = 3;

const units = [
  'cm',
  'mm',
  'in',
  'px',
  'pt',
  'pc',
  'em',
];

units.forEach(function (unit) {
  // some big number so that we get accurate, rounded conversions
  div.style.left = 1000 + unit;
  conv[unit] = Number((div.getBoundingClientRect().left / 1000).toFixed(MAX_DECIMALS));
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
    while (relativeParent && (!relativeParent.style || !/absolute|fixed|relative/.test(window.getComputedStyle(relativeParent).position))) {
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

  var left   = translateLengthToInteger(element.style.paddingLeft);
  var right  = translateLengthToInteger(element.style.paddingRight);
  var top    = translateLengthToInteger(element.style.paddingTop);
  var bottom = translateLengthToInteger(element.style.paddingBottom);

  var bounds = element.getBoundingClientRect();

  return {
    left   : left,
    right  : right,
    top    : top,
    bottom : bottom,
    width  : (bounds.right - bounds.left) - (right + left),
    height : (bounds.bottom - bounds.top) - (bottom + top),
  };
}

export function translateLengthToInteger(length, property, relativeElement) {
  if (length === '') return 0;

  if (isNaN(length) && typeof length === 'number') {
    throw new Error('length cannot be NaN');
  }

  return CSSParser.parse(CSSTokenizer.tokenize(length), astFactory).solveX({
    relativeElement: relativeElement,
    property       : property,
  });
}

const astFactory = {
  create(type, props) {
    return this[type] ? this[type](props) : { type: type, ...props };
  },
  call(props) {
    return {
      solveX(info) {
        for (let i = 0; i < props.params.length; i++) {
          const ret =  props.params[i].solveX(info);
          if (ret != void 0) return ret;
        }
      },
      toString() { },
    };
  },
  length(props) {
    switch (props.unit) {
      case '%' : return this.percLength(props);
      default  : return this.measuredLength(props);
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
        return props.value === 'xx' ? function (y) {
          return (y / bounds[scaleProperty]) * 100;
        } : (Number(props.value) / 100) * bounds[scaleProperty];
      },
    };
  },
  measuredLength(props) {
    return {
      solveX(info) {
        var reduce = this.prepare(info);
        return typeof reduce === 'function' ? reduce(info.y) : reduce;
      },
      prepare() {
        // console.log(Number(props.value), conv[props.unit]);
        return props.value === 'xx' ? function (y) {
          return y / conv[props.unit];
        } : Number(props.value) * Number(conv[props.unit]);
      },
    };
  },
  neg(props) {
    return {
      value: props.value,
      solveX(info) {
        var reduce = this.prepare(info);
        return typeof reduce === 'function' ? reduce(info.y) : reduce;
      },
      prepare(info) {
        var valueReduce = this.value.prepare(info);
        return typeof valueReduce === 'function' ? function (y) {
          return -valueReduce(-y);
        } : -valueReduce;
      },
    };
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
            return function (y) {
              return leftReduce(y + rightReduce);
            };
          // x + 5 = 100
          } else if (op === '+') {
            return function (y) {
              return leftReduce(y - rightReduce);
            };
          // x / 5 = 10
          } else if (op === '/') {
            return function (y) {
              return leftReduce(y * rightReduce);
            };
          // x * 5 = 10
          } else if (op === '*') {
            return function (y) {
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
      },
    };
  },
};

function tokenize(value) {
  var tokens = CSSTokenizer.tokenize(value);
  return tokens;
}

function translate(fromStyle, toStyle, element) {

  if (typeof fromStyle === 'string') {

    if (element) {
      console.warn('CSS length conversion from %s to %s should be wrapped in {width:fromStyle} and { width: toStyle } for an accurate measurement.', fromStyle, toStyle);
    }

    // just the unit present. Give a 0.
    if (!/\d+/.test(toStyle)) toStyle = 0 + toStyle;

    return translate({ left: fromStyle }, { left: toStyle }, element).left;
  }

  const translatedStyle = {};

  for (const property in fromStyle) {
    translatedStyle[property] = translateDeclaration(property, fromStyle[property], toStyle[property], element);
  }

  function translateDeclaration(property2, fromValue, toValue, element2) {
    if (!toValue) return fromValue;

    // fromValue could be a length. Need to normalize it so that
    // it can be converted into the toValue
    fromValue = translateLengthToInteger(fromValue, property2, element2);

    // first tokenize the toValue up
    const tokens = tokenize(toValue);

    // then replace the left-most length with X which be used
    // as the conversion value. Later on this might be customizable
    const firstNumber = tokens.find(function (token) {
      return token.type === 'number';
    });

    // change with X
    if (firstNumber) {
      firstNumber.value = 'xx';
    }

    // parse into the AST
    const ast = CSSParser.parse(tokens, astFactory);

    // take the fromValue and solveX - thus converting fromValue -> value
    const x = Number(ast.solveX({
      y: fromValue,
      relativeElement: element2,
      property: property2,
    }).toFixed(MAX_DECIMALS));

    return tokens.map(function (token) {
      return token.value;
    }).join('').replace(/-*xx/g, x);
  }

  return translatedStyle;
}

export function translateStyleToIntegers(style, relativeElement) {
  let toStyle = {};
  for (const key in style)  toStyle[key] = '0px';
  toStyle = translate(style, toStyle, relativeElement);
  for (const key in toStyle) toStyle[key] = Number(toStyle[key].replace('px', ''));
  return toStyle;
}

export default translate;
