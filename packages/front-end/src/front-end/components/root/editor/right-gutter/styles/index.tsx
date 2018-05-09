import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { RootState } from "../../../../../state";
import { compose, pure, withHandlers } from "recompose";
import { PaneComponent } from "../../../../pane";
import { PrettyStylesComponent } from "./pretty";
import { getSyntheticNodeById } from "paperclip";
import { getAttribute, EMPTY_OBJECT, stringifyStyle } from "../../../../../../common";
import { rawCssTextChanged } from "../../../../..";

/*
TODO - pretty tab, and source tab
*/

type StylePaneOuterProps = {
  dispatch: Dispatch<any>;
  root: RootState;
};

type StylePaneInnerProps = {
  onCssChange: () => any;
} & StylePaneOuterProps;

const BaseStylesPaneComponent = ({ root, onCssChange }: StylePaneInnerProps) => {

  if (!root.selectionReferences.length) {
    return null;
  }

  const node = getSyntheticNodeById(root.selectionReferences[0].id, root.browser);

  if (!node) {
    return null;
  }

  return <PaneComponent header="Styles" className="m-styles-pane">
    {/* <PrettyStylesComponent /> */}
    <div>CSS (temporary)</div>
    <textarea defaultValue={stringifyStyle(getAttribute(node, "style") || EMPTY_OBJECT).split(";").join(";\n")} style={{height: 400}} onChange={onCssChange}></textarea>
  </PaneComponent>;
}

export const StylesPaneComponent = compose<StylePaneInnerProps, StylePaneOuterProps>(
  pure,
  withHandlers({
    onCssChange: ({ dispatch }) => (event: React.ChangeEvent<any>) => {
      dispatch(rawCssTextChanged(event.target.value));
      event.stopPropagation();
    }
  })
)(BaseStylesPaneComponent);