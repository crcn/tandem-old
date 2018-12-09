import { EMPTY_ARRAY } from "tandem-common";
import { ComputedStyleInfo } from "paperclip";

// TODO - compute this information based on CSS properties

export enum CSSBackgroundType {
  SOLID,
  LINEAR_GRADIENT,
  IMAGE
}

export enum BackgroundBlendMode {
  SATURATION = "saturation"
}

export type CSSBaseBackground<TType extends CSSBackgroundType> = {
  type: TType;
  blendMode?: BackgroundBlendMode;
};

export type CSSSolidBackground = {
  color: string;
} & CSSBaseBackground<CSSBackgroundType.SOLID>;

export type CSSLinearGradientColorStop = {
  color: string;
  stop: number;
};

export type CSSLinearGradientBackground = {
  stops: CSSLinearGradientColorStop[];
} & CSSBaseBackground<CSSBackgroundType.LINEAR_GRADIENT>;

export type CSSImageBackground = {
  // https://www.w3schools.com/cssref/pr_background-image.asp
  uri: string;

  // https://www.w3schools.com/CSSref/pr_background-repeat.asp
  repeat: string;

  // https://www.w3schools.com/csSref/css3_pr_background-size.asp
  size: string;
} & CSSBaseBackground<CSSBackgroundType.IMAGE>;

export type CSSBackground =
  | CSSSolidBackground
  | CSSLinearGradientBackground
  | CSSImageBackground;

export const computeCSSBackgrounds = ({
  style
}: ComputedStyleInfo): CSSBackground[] => {
  const source = style["background-image"];

  if (!source) {
    return EMPTY_ARRAY;
  }

  let position = 0;

  const next = () => {
    const c = source[position++];

    if (/[a-zA-Z]/.test(c)) {
      const nextChunk = scan(/[\(,]/);
      console.log(nextChunk);
    }
  };

  const scan = (until: RegExp) => {
    const chunk = source.match(until);
    if (chunk) {
      position += chunk[0].length;
      return chunk[0];
    }

    return null;
  };

  const images =
    (style["background-image"] || "").match(/[\w-]+\(((?:R)|[^\)])*\)/) ||
    EMPTY_ARRAY;

  const n = next();

  if (!images) {
    return EMPTY_ARRAY;
  }

  return [];
};

export const stringifyCSSBackground = (background: CSSBackground) => {
  switch (background.type) {
    case CSSBackgroundType.IMAGE: {
      return `url(${background.uri})`;
    }
    case CSSBackgroundType.LINEAR_GRADIENT: {
      return `linear-gradient()`;
    }
    case CSSBackgroundType.SOLID: {
      return `${background.color}`;
    }
  }
};
