import { shallowEquals } from "./memoization";

export const updateProperties = <TState>(
  properties: Partial<TState>,
  target: TState
): TState => {
  const newProps: Partial<TState> = {};
  let hasNewProps = false;
  for (const key in properties) {
    const newValue = properties[key];
    if (!shallowEquals(target[key], properties[key])) {
      newProps[key] = newValue;
      hasNewProps = true;
    }
  }
  if (!hasNewProps) {
    return target;
  }

  return Object.assign({}, target, properties);
};
