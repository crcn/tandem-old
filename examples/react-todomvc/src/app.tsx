import React, { useState, ChangeEvent } from "react";
import App from "./app.pc";
import ListItem from "./item";
import Controls from "./controls";
import { Item } from "./data";

const DEFAULT_ITEMS: Item[] = [
  { id: 1, label: "Walk dog" },
  { id: 2, label: "take out trash" }
];

export default () => {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const onItemChange = (newItem: Item) => {
    setItems(
      items.map(item => {
        return item.id === newItem.id ? newItem : item;
      })
    );
  };

  return (
    <App
      items={items.map(item => (
        <ListItem item={item} onChange={onItemChange} />
      ))}
      controls={
        <Controls
          numItemsLeft={items.reduce(
            (left, item) => (!item.completed ? left + 1 : left),
            0
          )}
        />
      }
    />
  );
};
