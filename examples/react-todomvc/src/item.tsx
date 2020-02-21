import React, { useState, KeyboardEvent } from "react";
import BaseItem, { View, LabelInput } from "./item.pc";
import { Item } from "./data";

export type Props = {
  item: Item;
  onChange: (item: Item) => void;
};

export default ({ item, onChange }: Props) => {
  const [editing, setEditing] = useState(false);
  const onClick = () => {
    setEditing(true);
  };
  const onBlur = () => {
    setEditing(false);
  };
  const onLabelInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onChange({
        ...item,
        label: (event.target as HTMLInputElement).value
      });
      setEditing(false);
    }
  };
  return (
    <BaseItem completed={item.completed} onClick={onClick} onBlur={onBlur}>
      {editing ? (
        <LabelInput onKeyPress={onLabelInputKeyPress} />
      ) : (
        <View label={item.label} />
      )}
    </BaseItem>
  );
};
