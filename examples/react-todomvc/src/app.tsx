import React, { useState } from "react";
import { Props as ViewProps } from "./app.pc";
import { Item } from "./data";
import { identity } from "lodash";
import useLocation from "./hooks/useLocation";

const DEFAULT_ITEMS: Item[] = [
  { id: 1, label: "Walk dog" },
  { id: 2, label: "take out trash" },
  { id: 3, label: "clean car", completed: true }
];

const ITEM_FILTERS: {
  [identifier: string]: (item: Item) => boolean;
} = {
  active: (item: Item) => true,
  incomplete: (item: Item) => !item.completed,
  complete: (item: Item) => item.completed
};

export type Props = {};

export default (View: React.Factory<ViewProps>) => (props: Props) => {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const currentLocation = useLocation("active");
  const itemFilter = ITEM_FILTERS[currentLocation] || ITEM_FILTERS.active;

  const onItemChange = (newItem: Item) => {
    setItems(
      items.map(item => {
        return item.id === newItem.id ? newItem : item;
      })
    );
  };

  const onNewTodoInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const label = String((event.target as any).value).trim();
      if (label) {
        setItems([...items, { id: Date.now(), label }]);
      }
      (event.target as any).value = "";
    }
  };

  const onClearCompletedClicked = () => {
    setItems(items.filter(item => !item.completed));
  };

  return (
    <View
      newTodoInputProps={{ onKeyPress: onNewTodoInputKeyPress }}
      toggleAllProps={identity}
      items={items.filter(itemFilter)}
      listItemProps={props => {
        return {
          ...props,
          onChange: onItemChange
        };
      }}
      learnProps={identity}
      controlsProps={props => ({
        ...props,
        onClearCompletedClicked,
        items
      })}
    />
  );
};
