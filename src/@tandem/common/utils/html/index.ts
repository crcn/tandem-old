
export function translateAbsoluteToRelativePoint(event, relativeElement) {

  const zoom = relativeElement;

  const left = event.clientX || event.left;
  const top  = event.clientY || event.top;

  const bounds   = relativeElement.getBoundingClientRect();

  const rx = left - bounds.left;
  const ry = top  - bounds.top;

  return { left: rx, top: ry };
}