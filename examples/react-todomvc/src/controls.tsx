import React from "react";
import BaseControls, { styled } from "./controls.pc";

const Strong = styled("strong");

export type Props = {
  numItemsLeft: number;
};

export default ({ numItemsLeft }: Props) => {
  return (
    <BaseControls
      itemCountLabel={
        <span>
          <Strong>{numItemsLeft}</Strong> items left
        </span>
      }
    />
  );
};
