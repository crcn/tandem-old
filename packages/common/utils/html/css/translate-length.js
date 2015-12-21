import parseUnits from './parse-units';
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


var tokenizer = CSSTokenizer.create();

function translate(pixels, length, relativeElement) {

  // translate(100, 'em') just happened
  if (conv[length] || length === '%') {
    return translate(pixels, '0' + length, relativeElement);
  }
  var tokens = tokenizer.tokenize(length);

  var unitToken = tokens.find(function(token) {
    return token.type === 'unit';
  });

  var lengthToken = tokens.indexOf(unitToken - 1);

  if (unitToken.value === '%') {

    if (!relativeElement) {
      throw new Error('must have relative element for converting pixels to percentages');
    }

  }

  if (conv[unitToken.value]) {
    return Number((pixels / conv[unitToken.value]).toFixed(MAX_DECIMALS)) + unitToken.value;
  }
}

export default translate;
