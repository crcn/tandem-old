import * as React from "react";
import App from "./app.pc";
import Item from "./item";
import Controls from "./controls";

console.log(App);

export default () => {
  return <App items={[<Item />, <Item />, <Item />]} controls={<Controls />} />;
};
