import * as React from "react";
import * as path from "path";
import { compose, pure, withHandlers } from "recompose";
import { Dispatch } from "redux";
import { quickSearchItemClicked } from "actions";
import { File } from "tandem-common";

export type SearchResultsOuterProps = {
  file: File;
  cwd: string;
  filter: RegExp;
  dispatch: Dispatch<any>;
};

type SearchResultsInnerProps = {
  onClick: any;
} & SearchResultsOuterProps;

export default compose<SearchResultsInnerProps, SearchResultsOuterProps>(
  pure,
  withHandlers({
    onClick: ({ dispatch, file }) => () => {
      dispatch(quickSearchItemClicked(file));
    }
  }),
  Base => ({ onClick, file, cwd }: SearchResultsInnerProps) => {
    const basename = path.basename(file.uri);
    const directory = path
      .dirname(file.uri)
      .replace(cwd, "")
      .substr(1);

    return (
      <Base
        onClick={onClick}
        basenameProps={{ children: basename }}
        directoryProps={{ children: directory }}
      />
    );
  }
);
