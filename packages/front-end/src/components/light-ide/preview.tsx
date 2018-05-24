import "./preview.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { LightIDETextToken } from "./state";

export type PreviewComponentOuterProps = {
  tokens:  LightIDETextToken[]
};


// TODO - create token factory
const BasePreviewComponent = ({ tokens }: PreviewComponentOuterProps) => <div className="m-light-text-editor--preview">
  {
    tokens.map((token, i) => <span key={token.type + i} className={`token ${token.type}`}>{token.value}</span>)
  }
</div>;

const enhance = compose<PreviewComponentOuterProps, PreviewComponentOuterProps>(
  pure
);

export const PreviewComponent = BasePreviewComponent;