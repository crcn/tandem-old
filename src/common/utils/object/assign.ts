export default function(target, ...rest) {
  for (var value of rest) {
    for (var key in value) {
      target[key] = value[key];
    }
  }
}