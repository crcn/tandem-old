import * as React from "react";
import { compose, pure } from "recompose";

export default compose(pure, Base => ({ value }) => {
  console.log("COLOR PICKER");
  return <Base style={{ background: value }} />;
});
