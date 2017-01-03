import { hasURIProtocol } from "@tandem/common";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

export const resolveHTTPUrl = (href: string, relative: SyntheticHTMLElement) => {
  let newLocation;
  const location = relative.ownerDocument.defaultView.location;

  if (hasURIProtocol(href)) {
    newLocation = href;
  } else if (href.charAt(0) === "/") {
    if (href.substr(0, 2) === "//") {
      newLocation = location.protocol + href;
    } else {
      newLocation = location.protocol + "//" + location.host + href;
    }
  } else {
    newLocation = location.protocol + "//" + location.host + location.pathname + href;
  }
  
  return newLocation;
}