import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { RootState } from "../../../../../state";
import { compose, pure, withHandlers, lifecycle, withState } from "recompose";
import { PaneComponent } from "../../../../pane";
import { PrettyStylesComponent } from "./pretty";
import { getSyntheticNodeById } from "paperclip";
import { EMPTY_OBJECT, stringifyStyle } from "tandem-common";
import { rawCssTextChanged } from "../../../../..";

/*
TODO - pretty tab, and source tab
*/

type StylePaneOuterProps = {
  dispatch: Dispatch<any>;
  root: RootState;
};

type StylePaneInnerProps = {
  focused?: boolean;
  rawValue: any;
  setValue?: (value: string) => any;
  onCssChange: () => any;
  onFocus: () => any;
  onBlur: () => any;
  value: any;
} & StylePaneOuterProps;

const BaseStylesPaneComponent = ({
  root,
  onCssChange,
  onFocus,
  onBlur,
  value,
  focused
}: StylePaneInnerProps) => {
  return (
    <PaneComponent header="Styles" className="m-styles-pane">
      <div>CSS (temporary)</div>
      <textarea
        onFocus={onFocus}
        onBlur={onBlur}
        defaultValue={value}
        {...(focused ? EMPTY_OBJECT : { value: value })}
        style={{ height: 400 }}
        onChange={onCssChange}
      />
    </PaneComponent>
  );
};

const getSelectedNodeStyle = (root: RootState) => {
  const node = getSyntheticNodeById(
    root.selectedNodeIds[0],
    root.syntheticFrames
  );
  return (
    node &&
    stringifyStyle(node.style || EMPTY_OBJECT)
      .split(";")
      .join(";\n")
  );
};

export const StylesPaneComponent = compose<
  StylePaneInnerProps,
  StylePaneOuterProps
>(
  pure,
  withState("focused", "setFocus", false),
  withState("value", "setValue", ({ root }) => getSelectedNodeStyle(root)),
  withHandlers({
    onCssChange: ({ dispatch, setValue }) => (
      event: React.ChangeEvent<any>
    ) => {
      setValue(event.target.value);
      dispatch(rawCssTextChanged(event.target.value));
      event.stopPropagation();
    },
    onFocus: ({ setFocus }) => () => setFocus(true),
    onBlur: ({ setFocus }) => () => setFocus(false)
  }),
  lifecycle({
    componentDidUpdate({ focused, root, setValue }: StylePaneInnerProps) {
      if (this.props.root) {
        const oldValue = getSelectedNodeStyle(root);
        const newValue = getSelectedNodeStyle(this.props.root);
        if (!this.props.focused && oldValue !== newValue) {
          setValue(newValue);
        }
      }
    }
  })
)(BaseStylesPaneComponent);
