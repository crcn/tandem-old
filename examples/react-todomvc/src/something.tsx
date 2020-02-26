import React, { useState } from "react";
import { Props as ViewProps } from "./something.pc";

export type Props = {};

export default (View: React.Factory<ViewProps>) => (props: Props) => {
  const [count, setCount] = useState(0);
  console.log(count);
  return <View onItemClick={() => setCount(count + 1)} clickCount={count} />;
};
