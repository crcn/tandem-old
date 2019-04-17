import { BaseStyleInspectorProps, Declaration } from "./view.pc";
import * as React from "react";
import { ComputedStyleInfo } from "paperclip";
import { memoize } from "tandem-common";
import { Dispatch } from "redux";
import { cssInspectorDeclarationCreated } from "../../../../../../../../actions";

export type Props = {
  computedStyleInfo: ComputedStyleInfo;
  dispatch: Dispatch;
};

type State = {
  showNewDeclarationInput?: boolean;
};

export default (Base: React.ComponentClass<BaseStyleInspectorProps>) => {
  return class StyleInspectorController extends React.PureComponent<
    Props,
    State
  > {
    state = {
      showNewDeclarationInput: false
    };
    onClickAddNewStyle = () => {
      this.setState({ ...this.state, showNewDeclarationInput: true });
    };
    onCreateProperty = (name: string, value: string) => {
      this.props.dispatch(cssInspectorDeclarationCreated(name, value));
    };
    onNameChangeComplete = memoize(oldName => newName => {});
    onValueChangeComplete = memoize(name => value => {
      console.log("V CHANGE", this);
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
        onValueChangeComplete,
        onRemoveNewProperty,
        onLastDeclarationValueKeyDown
      } = this;
      const { showNewDeclarationInput } = this.state;
      const { computedStyleInfo } = this.props;

      const declarations = Object.keys(computedStyleInfo.style).map(
        (styleName, i, ary) => {
          return (
            <Declaration
              key={styleName}
              name={styleName}
              onNameChangeComplete={onNameChangeComplete(styleName)}
              onValueChangeComplete={onValueChangeComplete(styleName)}
              onValueKeyDown={
                i === ary.length - 1 ? onLastDeclarationValueKeyDown : null
              }
              value={computedStyleInfo.style[styleName]}
            />
          );
        }
      );
      if (showNewDeclarationInput) {
        declarations.push(
          <Declaration
            key={declarations.length}
            onCreate={onCreateProperty}
            onRemove={onRemoveNewProperty}
            focusName
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
