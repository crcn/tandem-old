import { BaseStyleInspectorProps, Declaration } from "./view.pc";
import * as React from "react";
import * as cx from "classnames";
import { ComputedStyleInfo } from "paperclip";
import { memoize } from "tandem-common";
import { Dispatch } from "redux";
import { isEqual } from "lodash";
import {
  cssInspectorDeclarationCreated,
  cssInspectorDeclarationChanged,
  cssInspectorDeclarationNameChanged
} from "../../../../../../../../actions";

export type Props = {
  computedStyleInfo: ComputedStyleInfo;
  dispatch: Dispatch;
};

type State = {
  showNewDeclarationInput?: boolean;
  sortedDeclarationNames: string[];
  _declarationNames?: string[];
};

export default (Base: React.ComponentClass<BaseStyleInspectorProps>) => {
  return class StyleInspectorController extends React.PureComponent<
    Props,
    State
  > {
    state = {
      showNewDeclarationInput: false,
      sortedDeclarationNames: []
    };

    static getDerivedStateFromProps(props: Props, state: State): State {
      let newState = state;
      const sortedDeclarationNames = Object.keys(props.computedStyleInfo.style);
      if (!isEqual(state._declarationNames, sortedDeclarationNames)) {
        newState = {
          ...newState,
          sortedDeclarationNames,
          _declarationNames: sortedDeclarationNames
        };
      }
      return newState === state ? null : newState;
    }

    onClickAddNewStyle = () => {
      this.setState({ ...this.state, showNewDeclarationInput: true });
    };
    onCreateProperty = (name: string, value: string) => {
      this.props.dispatch(cssInspectorDeclarationCreated(name, value));
      this.setState({
        ...this.state,
        sortedDeclarationNames: [...this.state.sortedDeclarationNames, name],
        showNewDeclarationInput: false
      });
    };
    onNameChangeComplete = memoize(oldName => newName => {
      this.props.dispatch(cssInspectorDeclarationNameChanged(oldName, newName));
    });
    onValueChange = memoize(name => value => {
      this.props.dispatch(cssInspectorDeclarationChanged(name, value || ""));
      this.setState({ ...this.state, showNewDeclarationInput: false });
    });
    onRemoveProperty = memoize(name => () => {
      this.props.dispatch(cssInspectorDeclarationChanged(name, undefined));
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
      const { showNewDeclarationInput, sortedDeclarationNames } = this.state;
      const { computedStyleInfo } = this.props;

      const declarations = sortedDeclarationNames.map((styleName, i, ary) => {
        const mixin = computedStyleInfo.styleMixinMap[styleName];
        const overrides = computedStyleInfo.styleOverridesMap[styleName];
        const isOverride = Boolean(overrides && overrides.length);
        const isVariant =
          isOverride && overrides.some(override => Boolean(override.variantId));
        const isInherited = Boolean(
          computedStyleInfo.styleInheritanceMap[styleName]
        );
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
            value={computedStyleInfo.style[styleName]}
            variant={cx({
              mixin: Boolean(mixin),
              override: isOverride && !isVariant,
              variant: isVariant,
              inherited: isInherited
            })}
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
          declarations={declarations}
          addStyleButtonProps={{
            onClick: onClickAddNewStyle
          }}
        />
      );
    }
  };
};
