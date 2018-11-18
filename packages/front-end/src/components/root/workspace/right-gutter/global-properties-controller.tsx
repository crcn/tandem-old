import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { PCVariable, PCMediaQuery } from "paperclip";
import { FontFamily } from "../../../../state";
import { BaseGlobalPropertiesProps } from "./view.pc";

export type Props = {
  show?: boolean;
  dispatch: Dispatch<any>;
  globalFileUri: string;
  globalVariables: PCVariable[];
  fontFamilies: FontFamily[];
  globalMediaQueries: PCMediaQuery[];
};

export default (Base: React.ComponentClass<BaseGlobalPropertiesProps>) =>
  class GlobalPropertiesController extends React.PureComponent<Props> {
    render() {
      const {
        dispatch,
        globalFileUri,
        globalMediaQueries,
        globalVariables,
        fontFamilies,
        ...rest
      } = this.props;
      return (
        <Base
          {...rest}
          variablesSectionProps={{
            show: true,
            dispatch,
            globalFileUri,
            globalVariables,
            fontFamilies
          }}
          mediaQueriesPaneProps={{
            dispatch,
            globalMediaQueries
          }}
        />
      );
    }
  };
