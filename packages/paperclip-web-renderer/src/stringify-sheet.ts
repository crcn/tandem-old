export const stringifyCSSSheet = sheet => {
  return sheet.rules.map(stringifyCSSRule).join("\n");
};

const stringifyCSSRule = rule => {
  switch (rule.type) {
    case "Style":
      return stringifyStyleRule(rule);
    case "Page":
    case "Supports":
    case "Media":
      return stringifyConditionRule(rule);
    case "FontFace":
      return stringifyFontFaceRule(rule);
  }
};

const stringifyConditionRule = ({ name, condition_text, rules }) => {
  return `@${name} ${condition_text} {
    ${rules.map(stringifyStyleRule).join("\n")}
  }`;
};

const stringifyFontFaceRule = ({ style }) => {
  return `@font-face {
    ${style.map(stringifyStyle).join("\n")}
  }`;
};

const stringifyStyleRule = ({ selector_text, style }) => {
  return `${selector_text} {
    ${style.map(stringifyStyle).join("\n")}
  }`;
};

const stringifyStyle = ({ name, value }) => `${name}:${value};`;
