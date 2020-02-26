import React from "react";
import { Props as ViewProps } from "./controls.pc";
import { Item } from "./data";

export type Props = {
  items: Item[];
};

// todo: Strong = styled('strong')

export default (View: React.Factory<ViewProps>) => ({ items }: Props) => {
  const numItemsLeft = items.filter(item => !item.completed).length;
  return (
    <View
      itemsLeftLabel={
        <span>
          <strong>{numItemsLeft}</strong> items left
        </span>
      }
      filters={[
        { label: "Active" },
        { label: "Incomplete" },
        { label: "Complete" }
      ]}
    />
  );
};
