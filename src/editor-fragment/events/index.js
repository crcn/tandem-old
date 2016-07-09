import { Event } from 'common/events';

export const STAGE_PREVIEW_MOUSE_DOWN = 'stagePreviewMouseDown';

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
