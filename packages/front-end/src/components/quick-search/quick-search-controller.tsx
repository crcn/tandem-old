import * as React from "react";
import { compose, pure, withState, withHandlers } from "recompose";
import { flattenTreeNode, File, isFile, memoize } from "tandem-common";
import { RootState } from "../../state";
import { Dispatch } from "redux";
import { BaseQuickSearchProps } from "./index.pc";
const { SearchResult } = require("./row.pc");

export type Props = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type InnerProps = {
  onInputChange: any;
  filter: string[];
} & Props;

const MAX_RESULTS = 50;

const getFilterTester = memoize(
  (filter: string[]) => new RegExp(filter.join(".*?"))
);

export default compose<BaseQuickSearchProps, Props>(
  pure,
  withState("filter", "setFilter", null),
  withHandlers({
    onInputChange: ({ setFilter }) => value => {
      const filter = String(value || "")
        .toLowerCase()
        .trim()
        .split(/\s+/g);

      setFilter(filter);
    }
  }),
  (Base: React.ComponentClass<BaseQuickSearchProps>) => ({
    filter,
    onInputChange,
    root,
    dispatch
  }: InnerProps) => {
    const allFiles = flattenTreeNode(root.projectDirectory) as File[];

    const results = filter
      ? allFiles
          .filter(file => {
            if (!isFile(file)) {
              return false;
            }
            const uri = file.uri;
            let lastIndex = 0;
            return getFilterTester(filter).test(uri);
          })
          .slice(0, MAX_RESULTS)
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
          onChange: onInputChange,
          focus: true
        }}
      />
    );
  }
);
