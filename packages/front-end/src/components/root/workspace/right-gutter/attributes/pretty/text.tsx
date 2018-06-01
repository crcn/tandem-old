import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { SyntheticTextNode } from "paperclip";
import { Dispatch } from "redux";
import { isEqual } from "lodash";
import { textValueChanged } from "../../../../../../actions";

type TextProps = {
  selectedNodes: SyntheticTextNode[];
  dispatch: Dispatch<any>;
};

type TextInnerProps = {
  onTextInputKeyDown: any;
} & TextProps;

export const BaseTextSettingsComponent = ({
  selectedNodes,
  onTextInputKeyDown
}: TextInnerProps) => {
  // TODO - will want to abstract this
  const modelNode = selectedNodes.reduce((model, node) => {
    for (const prop in node) {
      if (!isEqual(node[prop], model[prop])) {
        model = { ...model, [prop]: undefined };
      }
    }
    return model;
  }, selectedNodes[0]);
  return (
    <div>
      <input
        type="text"
        defaultValue={selectedNodes[0].value}
        onKeyDown={onTextInputKeyDown}
      />
    </div>
  );
};

export const TextSettingsComponent = compose<TextInnerProps, TextProps>(
  pure,
  withHandlers({
    onTextInputKeyDown: ({ dispatch }) => (event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter") {
        dispatch(textValueChanged((event.target as any).value));
      }
    }
  })
)(BaseTextSettingsComponent);
