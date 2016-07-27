import BoundingRect from 'sf-core/geom/bounding-rect';

export class HTMLNodePreview {
  constructor(readonly entity:any) {

  }
  get bounds():BoundingRect {
    return new BoundingRect(0, 0, 100, 100);
  }
}