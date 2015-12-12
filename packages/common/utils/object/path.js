// NOTE - ease implementation would be to use eval here, but
// that will result in security issues with FFox and other browsers

function _splitKeyPath(path) {
  return Array.isArray(path) ? path : path.split('.');
}

export function getValue(target, path) {

  var pathParts     = _splitKeyPath(path);
  var currentTarget = target;

  for (var pathPart of pathParts) {
    currentTarget = currentTarget[pathPart];
    if (currentTarget == void 0) break;
  }

  return currentTarget;
}

export function setValue(target, path, value) {

  var pathParts      = _splitKeyPath(path);
  var currentTarget  = target;

  for (var i = 0, n = pathParts.length; i < n - 1; i++) {

    var pathPart = pathParts[i];

    // this will bust if the type is not an object btw
    if (!currentTarget[pathPart]) {
      currentTarget = currentTarget[pathPart] = {};
    }
  }

  return currentTarget[pathParts[i]] = value;
}
