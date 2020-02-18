import { ReactNode, InputHTMLAttributes, ClassAttributes } from "react";

export type styled = (
  tagName: string
) => (
  props:
    | (InputHTMLAttributes<HTMLInputElement> &
        ClassAttributes<HTMLInputElement>)
    | null
) => ReactNode;

export type ItemProps = {};

export type Item = (props: ItemProps) => ReactNode;

export type ListProps = {
  children: String | boolean | Number | ReactNode;
};

export type List = (props: ListProps) => ReactNode;

export type PreviewProps = {};

export type Preview = (props: PreviewProps) => ReactNode;

export type Props = {
  primary: String | boolean | Number | ReactNode;
  secondary: String | boolean | Number | ReactNode;
  children: String | boolean | Number | ReactNode;
};

type Template = (props: Props) => ReactNode;
export default Template;
