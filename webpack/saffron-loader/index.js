var lang = require('../../public/build/lang');

module.exports = function(source) {
  this.cacheable();
  return String(lang.react.translate(lang.xml.parse(source)));
}
