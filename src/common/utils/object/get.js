var __getters = {};

export default function get(target, path) {
  if (__getters[path]) return __getters[path](target);
  var segments = path.split('.');
  var n        = segments.length;

  __getters[path] = function (target2) {

    var ctarget = target2;
    var parent;

    for (let i = 0; i < n; i++) {
      var segment = segments[i];

      if (!ctarget) break;

      if (!ctarget.hasOwnProperty(segment) && (parent = ctarget['[[parent]]'])) {
        return get(parent, segments.slice(i).join('.'));
      }

      ctarget = ctarget[segment];
    }

    return ctarget;
  };

  return get(target, path);
}
