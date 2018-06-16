import * as React from "react";
import * as path from "path";
import { compose, pure, withHandlers } from "recompose";
import { Dispatch } from "redux";
import { quickSearchItemClicked } from "actions";
import { File, memoize } from "tandem-common";

export type SearchResultsOuterProps = {
  file: File;
  cwd: string;
  filter: string[];
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
  Base => ({ filter, onClick, file, cwd }: SearchResultsInnerProps) => {
    const basename = highlightFilterMatches(path.basename(file.uri), filter);
    const directory = highlightFilterMatches(
      path
        .dirname(file.uri)
        .replace(cwd, "")
        .substr(1),
      filter
    );

    return (
      <Base
        onClick={onClick}
        basenameProps={{ children: basename }}
        directoryProps={{ children: directory }}
      />
    );
  }
);

const MATCH_STYLE: any = { fontWeight: 600, color: "#5f87cd" };

const getFilterReplacer = memoize(
  (filter: string[]) => new RegExp(filter.join("|"), "g")
);

const highlightFilterMatches = (str, filter: string[]) =>
  str
    .replace(getFilterReplacer(filter), match => {
      return `%%MATCH%%${match}%%MATCH%%`;
    })
    .split("%%MATCH%%")
    .map(
      match =>
        getFilterReplacer(filter).test(match) ? (
          <span style={MATCH_STYLE}>{match}</span>
        ) : (
          match
        )
    );
