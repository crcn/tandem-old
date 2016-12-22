import { BoundingRect } from "@tandem/common";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

export const fitBoundsInDocument = (element: SyntheticHTMLElement) => {

    let absoluteBounds = element.getAbsoluteBounds();

    const doc = element.ownerDocument.$ownerNode;

    // ensure that the bounds don't overflow -- this foos
    // with selecting other elements in other remote browsers
    if (doc) {
      const documentBounds    = (doc as SyntheticHTMLElement).getAbsoluteBounds();
      absoluteBounds = new BoundingRect(
        Math.max(absoluteBounds.left, documentBounds.left),
        Math.max(absoluteBounds.top, documentBounds.top),
        Math.min(absoluteBounds.right, documentBounds.right),
        Math.min(absoluteBounds.bottom, documentBounds.bottom)
      );
    }

    return absoluteBounds;
}