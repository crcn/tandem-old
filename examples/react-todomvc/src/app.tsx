import React, { useState } from "react";
import { Props as ViewProps } from "./app.pc";
import { Item } from "./data";
import { identity } from "lodash";

const DEFAULT_ITEMS: Item[] = [
  { id: 1, label: "Walk dog" },
  { id: 2, label: "take out trash" }
];

export type Props = {};

export default (View: React.Factory<ViewProps>) => (props: Props) => {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const onItemChange = (newItem: Item) => {
    setItems(
      items.map(item => {
        return item.id === newItem.id ? newItem : item;
      })
    );
  };

  const onNewTodoInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setItems([
        ...items,
        { id: Date.now(), label: (event.target as any).value }
      ]);
      (event.target as any).value = "";
    }
  };

  return (
    <View
      newTodoInputProps={{ onKeyPress: onNewTodoInputKeyPress }}
      toggleAllProps={identity}
      items={items}
      listItemProps={props => {
        return {
          ...props,
          onChange: onItemChange
        };
      }}
      learnProps={identity}
      controlsProps={props => ({
        ...props,
        items
      })}
    />
  );
};
