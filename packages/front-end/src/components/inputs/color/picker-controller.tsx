import * as React from "react";
import { pure, compose, lifecycle } from "recompose";

export default compose(
  pure,
  lifecycle({
    componentDidMount() {}
  }),
  Base => props => {
    return (
      <Base
        hslProps={{
          children: <div ref="hsl">HSL</div>
        }}
        spectrumProps={{
          children: <div ref="spectrum" />
        }}
        opacityProps={{
          children: <div ref="opacity" />
        }}
      />
    );
  }
);
