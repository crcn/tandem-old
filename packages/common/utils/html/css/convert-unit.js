import parseUnits from './parse-units';

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
  'pc'
];

units.forEach(function(unit) {

  // some big number so that we get accurate, rounded conversions
  div.style.left = 1000 + unit;
  conv[unit] = (Math.round(div.getBoundingClientRect().left) / 1000).toFixed(MAX_DECIMALS);
});

document.body.removeChild(div);

function convertUnits(a, b, relativeElement) {
  var [value, unit] = parseUnits(a);

  // normalize into pizels
  if (unit !== 'px') {
    value *= conv[unit];
  }

  if (conv[b]) {
    return (value/conv[b]).toFixed(MAX_DECIMALS) + b;
  }
}

export default convertUnits;
