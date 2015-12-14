export default function(value) {
  var match = value.match(/([-\d\.]+)(\w+)?/);
  // console.log(match);

  return [Number(match[1]), match[2] || 'px'];
  // return match ? [match[0], match[1] || 'px'] : [0, 'px'];
}
