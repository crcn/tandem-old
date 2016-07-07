import get from 'common/utils/object/get';

export default function(property, map) {

  if (!map) map = function(value) {
    return value;
  };

  return function(context) {
    return map(get(context, property));
  }
};
