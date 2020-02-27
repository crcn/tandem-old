import React from "react";
import { Props as ViewProps } from "./controls.pc";
import { Item } from "./data";
import useLocation from "./hooks/useLocation";

export type Props = {
  items: Item[];
  onClearCompletedClicked: () => void;
};

// todo: Strong = styled('strong')

export default (View: React.Factory<ViewProps>) => ({
  items,
  onClearCompletedClicked
}: Props) => {
  const numItemsLeft = items.filter(item => !item.completed).length;
  const currentLocation = useLocation("active");
  return (
    <View
      clearCompletedButtonProps={{
        onClick: onClearCompletedClicked
      }}
      itemsLeftLabel={
        <span>
          <strong>{numItemsLeft}</strong> items left
        </span>
      }
      filters={[
        {
          label: "Active",
          href: "#active",
          active: currentLocation === "active"
        },
        {
          label: "Incomplete",
          href: "#incomplete",
          active: currentLocation === "incomplete"
        },
        {
          label: "Complete",
          href: "#complete",
          active: currentLocation === "complete"
        }
      ]}
    />
  );
};
