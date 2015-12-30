

function calculateDistances(rootEntity, b1) {

  // first flatten & filter for all component entities
  var allBounds = rootEntity.filter(function(entity) {
    return /component/.test(entity.type) && !!entity.hasComputer();
  }).map(function(entity) {
    return entity.getComputedStyle();
  });

  var intersections = {
    north : [b1],
    south : [b1],
    east : [b1],
    west : [b1]
  };

  allBounds.forEach(addIntersections.bind(this, intersections, b1));
  intersections = sortIntersections(intersections);

  var lines = convertToLines(intersections);

  return lines;
}

function sortIntersections({ north, east, south, west }) {
  return {
    north : north.sort(function(a, b) { return a.top  < b.top  ? -1 : 1 }),
    south : south.sort(function(a, b) { return a.top  > b.top  ? -1 : 1 }),
    east : east.sort(function(a, b) { return a.left > b.left ? -1 : 1 }),
    west : west.sort(function(a, b) { return a.left < b.left ? -1 : 1 })
  }
}

function convertToLines({ north, east, south, west }) {
  return [
    ...mapIntersectingBounds(north),
    ...mapIntersectingBounds(south),
    ...mapIntersectingBounds(east),
    ...mapIntersectingBounds(west),
  ];
}

function mapIntersectingBounds(items) {
  var bounds = [];
  var prev = items[0];
  for (var i = 1, n = items.length; i < n; i++) {
    var current = items[i];
    bounds.push(calculateIntersectingBounds(current, prev));
    prev = current;
  }
  return bounds;
}

function calculateIntersectingBounds(b1, b2) {

  // north / south

  var b1Left   = b1.left;
  var b1Right  = b1.left + b1.width;
  var b1Top    = b1.top;
  var b1Bottom = b1.top + b1.height;

  var b2Left   = b2.left;
  var b2Right  = b2.left + b2.width;
  var b2Top    = b2.top;
  var b2Bottom = b2.top + b2.height;

  var b3Left;
  var b3Top;
  var b3Bottom;
  var b3Right;
  var direction;

  // east west
  if (intersectsTop(b1, b2)) {

    if (b1Left < b2Left) {
      b3Left  = b1Right;
      b3Right = b2Left;
    } else {
      b3Left  = b2Right;
      b3Right = b1Left;
    }

    b3Top    = Math.max(b1Top    , b2Top);
    b3Bottom = Math.min(b1Bottom , b2Bottom);
    direction = 'ew';

  } else {
    if (b1Top < b2Top) {
      b3Top    = b1Bottom;
      b3Bottom = b2Top;
    } else {
      b3Top    = b2Bottom;
      b3Bottom = b1Top;
    }

    b3Left    = Math.max(b1Left, b2Left);
    b3Right   = Math.min(b1Right, b2Right);
    direction = 'ns';
  }

  return {
    left      : Math.round(b3Left),
    top       : Math.round(b3Top),
    width     : Math.round(b3Right - b3Left),
    height    : Math.round(b3Bottom - b3Top),
    direction : direction
  }
}

function addIntersections({ north, east, south, west }, b1, b2) {

  // intersect, but do not overlap
  if (intersectsLeft(b1, b2) && !intersectsTop(b1, b2)) {

    // north
    if (b2.top < b1.top) {
      north.push(b2);

      // south
    } else if (b2.top > b1.top) {
      south.push(b2);
    }
  }

  if (intersectsTop(b1, b2) && !intersectsLeft(b1, b2)) {

    // east
    if (b2.left > b1.left) {
      east.push(b2);

      // west
    } else if (b2.left < b1.left) {
      west.push(b2);
    }
  }
}

function intersectsTop(a, b) {
  return _intersectsTop(a, b) || _intersectsTop(b, a);
}

function _intersectsTop(a, b) {
  return a.top <= b.top && (a.top + a.height) >= b.top;
}

function intersectsLeft(a, b) {
  return _intersectsLeft(a, b) || _intersectsLeft(b, a);
}

function _intersectsLeft(a, b) {
  return a.left <= b.left && (a.left + a.width) >= b.left;
}

export default calculateDistances;
