import BoundingRect from 'common/geom/bounding-rect';
import { calculateBoundingRect }from 'common/utils/geom';
import _calculateBoundingRect from './_calculate-bounding-rect';

export default class GroupPreview {
  constructor(entity) {
    this.entity = entity;
  }

  getBoundingRect(zoom) {
    var rect = calculateBoundingRect(this.entity.section.childNodes.map(function(node) {
      return _calculateBoundingRect(node);
    }));

    return rect;
  }
}
