import { ComputedStyleInfo } from "paperclip";

// TODO - compute this information based on CSS properties

export enum CSSBackgroundType {
  SOLID,
  LINEAR_GRADIENT,
  IMAGE
}

export type CSSBaseBackground<TType extends CSSBackgroundType> = {
  type: TType;
};

export type CSSSolidBackground = {
  color: string;
} & CSSBaseBackground<CSSBackgroundType.SOLID>;

export type CSSLinearGradientBackground = {} & CSSBaseBackground<
  CSSBackgroundType.LINEAR_GRADIENT
>;

export type CSSImageBackground = {
  uri: string;
} & CSSBaseBackground<CSSBackgroundType.IMAGE>;

export type CSSBackground =
  | CSSSolidBackground
  | CSSLinearGradientBackground
  | CSSImageBackground;

export const computeCSSBackgrounds = (
  style: ComputedStyleInfo
): CSSBackground[] => {
  return [];
};
