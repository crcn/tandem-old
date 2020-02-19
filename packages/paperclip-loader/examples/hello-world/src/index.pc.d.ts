import {
  ReactNode,
  ReactHTML,
  Factory,
  InputHTMLAttributes,
  ClassAttributes
} from "react";

type BaseProps = InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement>;

export declare const styled: (
  tag: keyof ReactHTML | Factory<BaseProps>,
  defaultProps?: BaseProps
) => Factory<BaseProps>;

export type ItemProps = {
  children: String | boolean | Number | ReactNode;
} & BaseProps;

export declare const Item: Factory<ItemProps>;

export type Props = {
  children: String | boolean | Number | ReactNode;
} & BaseProps;

declare const Template: Factory<Props>;
export default Template;
