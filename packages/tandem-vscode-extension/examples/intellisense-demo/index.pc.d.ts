import { ReactNode, InputHTMLAttributes, ClassAttributes } from "react";

export type styled = (
  tagName: string
) => (
  props:
    | (InputHTMLAttributes<HTMLInputElement> &
        ClassAttributes<HTMLInputElement>)
    | null
) => ReactNode;

type ItemProps = {};

export { ItemProps };

type PreviewProps = {};

export { PreviewProps };

type ComponentProps = {
  children: String | boolean | Number | ReactNode;
};

export default ComponentProps;
