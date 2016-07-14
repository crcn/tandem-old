import BoundingRect from 'common/geom/bounding-rect';

export default class GroupPreview {
  constructor(entity) {
    this.entity = entity;
  }

  getBoundingRect(zoom) {
    return BoundingRect.create({
      left: 100,
      top: 100,
      right: 200,
      bottom: 200
    });
  }
}
