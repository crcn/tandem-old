import * as React from "react";
import { BaseContextMenuProps } from "./view.pc";

export type ContextMenuOption = {
  label: string;
  value: any;
};

export type Props = {
  options: ContextMenuOption[];
} & BaseContextMenuProps;

export default (Base: React.ComponentClass<BaseContextMenuProps>) => class ContextMenuController extends React.PureComponent<Props> {
  render() {
    const {...rest} = this.props;
    return <Base {...rest} />;
  }
}