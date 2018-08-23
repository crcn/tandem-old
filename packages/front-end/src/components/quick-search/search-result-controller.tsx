import * as React from "react";
import * as path from "path";
import { compose, pure, withHandlers } from "recompose";
import { Dispatch } from "redux";
import { quickSearchItemClicked } from "../../actions";
import { File, memoize } from "tandem-common";
import { BaseSearchResultProps } from "./row.pc";

export type Props = {
  file: File;
  cwd: string;
  filter: string[];
  dispatch: Dispatch<any>;
};

type InnerProps = {
  onClick: any;
} & Props;

export default compose<BaseSearchResultProps, Props>(
  pure,
  withHandlers({
    onClick: ({ dispatch, file }) => () => {
      dispatch(quickSearchItemClicked(file));
    }
  }),
  (Base: React.ComponentClass<BaseSearchResultProps>) => ({
    filter,
    onClick,
    file,
    cwd
  }: InnerProps) => {
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
      (match, i) =>
        getFilterReplacer(filter).test(match) ? (
          <span style={MATCH_STYLE} key={i}>
            {match}
          </span>
        ) : (
          match
        )
    );
