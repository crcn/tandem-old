import { BaseKeyValueListProps, KeyValueItem } from "./view.pc";
import { KeyValuePair } from "tandem-common";
import * as React from "react";
import { Dispatch } from "redux";

export type Props = {
  items: KeyValuePair<any>[];
  showNewInput?: boolean;
  onInsertNewRow: () => void;
};

type State = {
  showNewInput?: boolean;
};

export default (Base: React.ComponentClass<BaseKeyValueListProps>) => {
  return class KeyValueListController extends React.Component<Props, State> {
    state = { showNewInput: false };

    static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
      if (nextProps.showNewInput != null) {
        return {
          ...prevState,
          showNewInput: nextProps.showNewInput
        };
      }
      return prevState;
    }

    onLastEnterPressed = () => {
      this.props.onInsertNewRow();
    };
    render() {
      const { onLastEnterPressed } = this;
      const { items } = this.props;
      const { showNewInput } = this.state;
      const itemComponents = items.map(({ key, value }, i) => {
        const isLast = i === items.length - 1;
        return (
          <KeyValueItem
            key={i}
            name={key}
            editName={isLast && showNewInput}
            value={value}
            onValueEnterPressed={
              isLast && !showNewInput ? onLastEnterPressed : null
            }
          />
        );
      });

      return (
        <Base
          items={itemComponents}
          keyValueItemProps={null}
          keyValueItemTextInputProps={null}
          keyValueItemProps1={null}
          keyValueItemProps2={null}
          keyValueItemProps3={null}
        />
      );
    }
  };
};
