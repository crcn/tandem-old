import React from "react";
import BaseControls, { styled } from "./controls.pc";

const Strong = styled("strong");

export type Props = {};

export default (_props: Props) => {
  return (
    <BaseControls
      itemCountLabel={
        <span>
          <Strong>1</Strong> items left
        </span>
      }
    />
  );
};
