export default function(value) {
  return Array.isArray(value) ? value : value == void 0 ? [] : [value];
};