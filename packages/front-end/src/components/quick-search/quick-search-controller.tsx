import * as React from "react";
import { compose, pure, withState, withHandlers } from "recompose";
import { flattenTreeNode, File, isFile } from "tandem-common";
import { RootState } from "../../state";
import { Dispatch } from "react-redux";
const { SearchResult } = require("./row.pc");

export type QuickSearchOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type QuickSearchInnerProps = {
  onInputChange: any;
  filter: RegExp;
} & QuickSearchOuterProps;

export default compose(
  pure,
  withState("filter", "setFilter", null),
  withHandlers({
    onInputChange: ({ setFilter }) => value => {
      const filter = new RegExp(
        String(value || "")
          .toLowerCase()
          .trim()
          .replace(/\s/g, ".*?")
      );

      setFilter(filter);
    }
  }),
  Base => ({
    filter,
    onInputChange,
    root,
    dispatch
  }: QuickSearchInnerProps) => {
    const allFiles = flattenTreeNode(root.projectDirectory) as File[];

    const results = filter
      ? allFiles
          .filter(file => {
            if (!isFile(file)) {
              return false;
            }
            const uri = file.uri;
            let lastIndex = 0;
            return filter.test(uri);
          })
          .map(file => {
            return (
              <SearchResult
                filter={filter}
                cwd={root.projectDirectory.uri}
                file={file}
                key={file.id}
                textProps={{
                  children: file.uri
                }}
                dispatch={dispatch}
              />
            );
          })
      : [];

    return (
      <Base
        searchResultsProps={{
          children: results
        }}
        quickSearchInputProps={{
          onChange: onInputChange
        }}
      />
    );
  }
);
