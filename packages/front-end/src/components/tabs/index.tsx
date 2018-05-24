import * as React from "react";
import { Dispatch } from "redux";
import { compose, pure } from "recompose";
const { Tabs: BaseTabs, Tab: BaseTab } = require("./index.pc");

export type TabItem = {
  selected: boolean;
  label: string;
  value: any;
};

type TabsOuterProps = {
  items: TabItem[];
  style?: any;
  onTabClick: (item: TabItem) => any;
  children: any;
};

export const TabsComponent = compose<TabsOuterProps, TabsOuterProps>(pure)(
  ({ items, style, onTabClick, children }: TabsOuterProps) => {
    return (
      <BaseTabs
        style={style}
        barChildren={items.map((item, i) => {
          return (
            <BaseTab
              labelChildren={item.label}
              variants={item.selected ? ["Selected"] : null}
              onClick={() => onTabClick(item)}
            />
          );
        })}
        contentChildren={children}
      />
    );
  }
);
