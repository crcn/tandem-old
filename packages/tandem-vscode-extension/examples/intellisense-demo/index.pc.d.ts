import { ReactNode, InputHTMLAttributes, ClassAttributes } from "react";

export type styled = (
  tagName: string
) => (
  props:
    | (InputHTMLAttributes<HTMLInputElement> &
        ClassAttributes<HTMLInputElement>)
    | null
) => ReactNode;

type PreviewProps = {
  something: String | boolean | Number | ReactNode;
  somethingElse: String | boolean | Number | ReactNode;
  value: String | boolean | Number | ReactNode;
  doSomething: Function;
  onClick: String | boolean | Number | ReactNode;
};

export { PreviewProps };

type ComponentProps = {
  something: String | boolean | Number | ReactNode;
  somethingElse: String | boolean | Number | ReactNode;
  value: String | boolean | Number | ReactNode;
  doSomething: Function;
  onClick: String | boolean | Number | ReactNode;
};

export default ComponentProps;
