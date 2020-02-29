import React, { useState, KeyboardEvent } from "react";
import View, { LabelInput, TodoLabel } from "./item.pc";
import { Item } from "./data";

type Props = {
  item?: Item;
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

  const toggleCompleted = () =>
    onChange({
      ...item,
      completed: !item.completed
    });

  return (
    <View completed={item.completed}>
      {editing ? (
        <LabelInput
          onBlur={onBlur}
          label={item.label}
          onKeyPress={onLabelInputKeyPress}
        />
      ) : (
        <TodoLabel
          onCheckChange={toggleCompleted}
          completed={item.completed}
          label={item.label}
          onLabelClick={onClick}
        />
      )}
    </View>
  );
};
