import { IEntity } from './index';
import BoundingRect from 'geom/bounding-rect';

class Capabilities {
  constructor(
    public movable:boolean,
    public resizable:boolean
  ) { }

  merge(...capabilities:Array<Capabilities>):Capabilities {
    return capabilities.reduce(function(prev:Capabilities, cur:Capabilities):Capabilities {
      if (!prev) return cur;
      return new Capabilities(
        prev.movable && cur.movable,
        prev.resizable && cur.movable
      );
    });
  }
}
/**
 * 
 */

export default class HTMLEntityPreview {
  
  constructor(public entity:IEntity, public node:HTMLElement) {

  }

  public get capabilities():Capabilities {
    return new Capabilities(true, true);
  }

  public get zoom():number {
    return 0;
  }

  public get bounds():BoundingRect {
    let { left, top, right, bottom } = this.node.getBoundingClientRect();
    return new BoundingRect(left, top, right, bottom);
  }

  public set bounds(bounds:BoundingRect) {
    console.log('setting bounds');
  }
}