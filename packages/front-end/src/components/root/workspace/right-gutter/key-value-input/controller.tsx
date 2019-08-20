import { BaseKeyValueListProps, KeyValueItem } from "./view.pc";
import { KeyValuePair } from "tandem-common";
import * as React from "react";

export type Props = {
  items: KeyValuePair<any>[];
};

export default (Base: React.ComponentClass<BaseKeyValueListProps>) => {
  return class KeyValueListController extends React.Component<Props> {
    render() {
      const { items } = this.props;
      const itemComponents = items.map(({ key, value }, i) => {
        console.log(key, value);
        return <KeyValueItem key={i} label={key} value={value} />;
      });
      console.log(items);
      return <Base items={itemComponents} />;
    }
  };
};
