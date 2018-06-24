import * as React from "react";
import { compose, pure } from "recompose";
import { PCSourceTagNames } from "paperclip";
const { TextProperties, ElementProperties } = require("./view.pc");

export default compose(pure, Base => props => {
  const { selectedNodes } = props;

  if (!selectedNodes.length) {
    return null;
  }

  const name = selectedNodes[0].name;

  let section = null;

  if (name === PCSourceTagNames.TEXT) {
    section = <TextProperties {...props} />;
  } else {
    section = <ElementProperties {...props} />;
  }

  return <Base {...props}>{section}</Base>;
});
