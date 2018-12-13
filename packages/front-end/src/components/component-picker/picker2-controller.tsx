import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import {
  BaseComponentPopdownPickerProps,
  ComponentPickerPopdownItem
} from "./picker.pc";
import { PCComponent, DependencyGraph, getAllPCComponents } from "paperclip";
import { componentPickerItemClick } from "../../actions";

export type Props = {
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
};

type State = {
  filter: string[];
};

export default (Base: React.ComponentClass<BaseComponentPopdownPickerProps>) =>
  class Picker2Controller extends React.PureComponent<Props, State> {
    state = {
      filter: []
    };

    onFilterChange = value => {
      this.setState({
        ...this.state,
        filter: String(value || "")
          .toLowerCase()
          .trim()
          .split(/\s+/g)
      });
    };
    onClickComponent = component => {
      this.props.dispatch(componentPickerItemClick(component));
    };
    render() {
      const { onClickComponent, onFilterChange } = this;
      const { graph } = this.props;
      const { filter } = this.state;
      const components = getAllPCComponents(graph);
      const items = components
        .filter(component => {
          const label = (component.label || "").toLowerCase();
          for (const part of filter) {
            if (label.indexOf(part) === -1) {
              return false;
            }
          }

          return true;
        })
        .map((component, i) => {
          return (
            <ComponentPickerPopdownItem
              key={component.id}
              onClick={() => onClickComponent(component)}
              componentNameProps={{ text: component.label }}
              variant={cx({
                alt: !Boolean(i % 2)
              })}
            />
          );
        });
      return (
        <Base
          {...this.props}
          variant={cx({
            noComponents: items.length === 0
          })}
          filterProps={{ focus: true, onChange: onFilterChange }}
          items={items}
        />
      );
    }
  };
