import { compose, pure } from "recompose";
import { BaseHexInputProps } from "./picker.pc";

export type Props = BaseHexInputProps;

export default compose<BaseHexInputProps, Props>(pure);
