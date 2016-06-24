export default function(value) {
  return typeof value === 'function' ? value : function() {
    return value;
  }
}
