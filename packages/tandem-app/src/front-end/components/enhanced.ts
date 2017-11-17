
import { enhanceComponents } from "./index.pc";

import {
  enhanceTdComponentsPane
} from "./components-pane";

export const enhanced = enhanceComponents({
  enhanceTdComponentsPane,
  enhanceTdBanner: null,
  enhanceTdList: null,
  enhanceTdListItem: null,
  enhanceTdPane: null,

  // todo 
  enhanceTdPreviewComponentExample: null,
  enhanceTdProgress: null,
  enhanceTdProgressExample: null
});

