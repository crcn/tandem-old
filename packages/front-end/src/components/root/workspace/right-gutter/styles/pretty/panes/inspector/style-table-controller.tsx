import * as React from "react";
import { BaseStyleTableProps, Declaration } from "./view.pc";
import { KeyValue } from "tandem-common";
import { isEqual } from "lodash";
import { Dispatch } from "redux";
import { memoize } from "tandem-common";

export type Props = {
  style: KeyValue<string>;
  dispatch: Dispatch;
};

type State = {
  showNewDeclarationInput?: boolean;
  declarationNames: string[];
  _declarationNames?: string[];
};

export default (Base: React.ComponentClass<BaseStyleTableProps>) => {
  return class StyleInspectorController extends React.PureComponent<
    Props,
    State
  > {
    state = {
      showNewDeclarationInput: false,
      declarationNames: []
    };

    static getDerivedStateFromProps(props: Props, state: State): State {
      let newState = state;
      const sortedDeclarationNames = Object.keys(props.style || {}).sort();

      if (!isEqual(state._declarationNames, sortedDeclarationNames)) {
        newState = { ...newState, _declarationNames: sortedDeclarationNames };
        if (
          !state.declarationNames ||
          !isEqual([...state.declarationNames].sort(), sortedDeclarationNames)
        ) {
          newState = {
            ...newState,
            declarationNames: sortedDeclarationNames
          };
        }
      }
      return newState === state ? null : newState;
    }

    onClickAddNewStyle = () => {
      this.setState({ ...this.state, showNewDeclarationInput: true });
    };
    onCreateProperty = (name: string, value: string) => {
      this.setState(
        {
          ...this.state,
          declarationNames: [...this.state.declarationNames, name],
          showNewDeclarationInput: false
        },
        () => {
          // this.props.dispatch(cssInspectorDeclarationCreated(name, value));
        }
      );
    };

    onNameChangeComplete = memoize(oldName => newName => {
      // this.props.dispatch(cssInspectorDeclarationNameChanged(oldName, newName));
    });
    onValueChange = memoize(name => value => {
      // this.props.dispatch(cssInspectorDeclarationChanged(name, value || ""));
      this.setState({ ...this.state, showNewDeclarationInput: false });
    });
    onRemoveProperty = memoize(name => () => {
      // this.props.dispatch(cssInspectorDeclarationChanged(name, undefined));
    });
    onRemoveNewProperty = () => {
      this.setState({ ...this.state, showNewDeclarationInput: false });
    };
    onLastDeclarationValueKeyDown = (event: React.KeyboardEvent<any>) => {
      if (event.key === "Tab" && !event.shiftKey) {
        this.setState({ ...this.state, showNewDeclarationInput: true });
      }
    };
    render() {
      const {
        onClickAddNewStyle,
        onCreateProperty,
        onNameChangeComplete,
        onValueChange,
        onRemoveProperty,
        onRemoveNewProperty,
        onLastDeclarationValueKeyDown
      } = this;
      const { showNewDeclarationInput, declarationNames } = this.state;
      const { style = {} } = this.props;

      const declarations = declarationNames.map((styleName, i, ary) => {
        return (
          <Declaration
            key={i}
            name={styleName}
            onNameChangeComplete={onNameChangeComplete(styleName)}
            onValueChange={onValueChange(styleName)}
            onRemove={onRemoveProperty(styleName)}
            onValueKeyDown={
              i === ary.length - 1 ? onLastDeclarationValueKeyDown : null
            }
            value={style[styleName]}
          />
        );
      });

      if (showNewDeclarationInput) {
        declarations.push(
          <Declaration
            key={declarations.length}
            onCreate={onCreateProperty}
            onRemove={onRemoveNewProperty}
            focusName
            onValueKeyDown={onLastDeclarationValueKeyDown}
          />
        );
      }

      return (
        <Base
          content={declarations}
          declarationProps={null}
          declarationProps1={null}
          declarationProps2={null}
          declarationProps3={null}
          declarationProps4={null}
        />
      );
    }
  };
};
