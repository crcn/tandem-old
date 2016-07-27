import BoundingRect from 'sf-core/geom/bounding-rect';
import { IEntityDisplay } from 'sf-core/entities';

export class HTMLNodeDisplay implements IEntityDisplay {
  constructor(readonly entity:any) {

  }
  get node():Element {
    return this.entity.section.targetNode;
  }

  get bounds():BoundingRect {
    let { left, top, right, bottom } = this.node.getBoundingClientRect();
    return new BoundingRect(left, top, right, bottom);
  }
}