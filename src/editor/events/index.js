import { Event } from 'common/events';

export const STAGE_CANVAS_MOUSE_DOWN = 'stageCanvasMouseDown';

export class MouseEvent extends Event {
  constructor(type, originalEvent) {
    super(type);

    Object.assign(this, {
      clientX: originalEvent.clientX,
      clientY: originalEvent.clientY,
      metaKey : originalEvent.metaKey
    });
  }
}
