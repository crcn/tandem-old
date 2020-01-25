export const stringifyCSSSheet = sheet => {
  return sheet.rules.map(stringifyCSSRule).join("\n");
};

const stringifyCSSRule = rule => {
  switch (rule.type) {
    case "CSSStyleRule":
      return stringifyCSSStyleRule(rule);
  }
};

const stringifyCSSStyleRule = ({ selectorText, style }) => {
  return `${selectorText} {
    ${style.map(stringifyStyle).join("\n")}
  }`;
};

const stringifyStyle = ({ name, value }) => `${name}:${value};`;
