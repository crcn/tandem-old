import * as React from "react";
import { flattenTreeNode, File, isFile, memoize } from "tandem-common";
import { RootState } from "../../state";
import { Dispatch } from "redux";
import { BaseQuickSearchProps } from "./index.pc";
import { SearchResult } from "./row.pc";

export type Props = {
  root: RootState;
  dispatch: Dispatch<any>;
};

const MAX_RESULTS = 50;

const getFilterTester = memoize(
  (filter: string[]) => new RegExp(filter.join(".*?"))
);

type State = {
  filter: string[];
};

export default (Base: React.ComponentClass<BaseQuickSearchProps>) =>
  class QuickSearchController extends React.PureComponent<Props, State> {
    state = {
      filter: null
    };
    setFilter = (value: string[]) => {
      this.setState({ ...this.state, filter: value });
    };
    onInputChange = value => {
      const filter = String(value || "")
        .toLowerCase()
        .trim()
        .split(/\s+/g);

      this.setFilter(filter);
    };
    render() {
      const { root, dispatch } = this.props;
      const { filter } = this.state;
      const { onInputChange } = this;

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
  };
