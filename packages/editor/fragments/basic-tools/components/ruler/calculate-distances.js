

function calculateDistances(rootEntity, b1) {

  // first flatten & filter for all component entities
  var allEntities = rootEntity.filter(function(entity) {
    return /component/.test(entity.type);
  });

  // next find all entities that intersect with the given bounds
  var intersects = allEntities.filter(function(entity) {
    return boundsIntersect(entity.getComputedStyle(), b1);
  });

  allEntities.forEach(function(entity) {
    var b2 = entity.getComputedStyle();


    if (intersectsY(b1, b2) || intersectsY(b2, b1)) {
      console.log('IY');
      // var p1 = 
    }
  });

  return intersects;
}


function boundsIntersect(a, b) {
  return (
    intersectsY(a, b) || // a north of b
    intersectsY(b, a) || // a south of b
    intersectsX(a, b) || // a west of b
    intersectsX(b, a)    // a east of b
  );
}

function intersectsY(a, b) {
  return a.top <= b.top && (a.top + a.height) >= b.top;
}

function intersectsX(a, b) {
  return a.left <= b.left && (a.left + a.width) >= b.left;
}

export default calculateDistances;
