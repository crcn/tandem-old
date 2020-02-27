import React, { useState, KeyboardEvent } from "react";
import { Props as ViewProps } from "./item.pc";
import { Item } from "./data";

export type Props = {
  item?: Item;
  onChange: (item: Item) => void;
};

export default (View: React.Factory<ViewProps>) => ({
  item,
  onChange
}: Props) => {
  if (!item) {
    throw new Error(`item is not defined`);
  }
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
    <View
      label={item.label}
      onLabelClick={onClick}
      completed={item.completed}
      editing={editing}
      completeCheckboxProps={{
        onChange: toggleCompleted
      }}
      labelInputProps={{
        onKeyPress: onLabelInputKeyPress,
        onBlur: onBlur
      }}
    />
  );
};
