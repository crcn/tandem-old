import { Props as ViewProps } from "./item.pc";

export type Props = {} & Partial<ViewProps>;

export const Controller = (View: (ViewProps) => void) => (props: Props) => {
  return View(props);
};
