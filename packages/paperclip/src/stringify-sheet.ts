export const stringifyCSSSheet = sheet => {
  return sheet.rules.map(stringifyCSSRule).join("\n");
};

const stringifyCSSRule = rule => {
  switch (rule.type) {
    case "CSSStyleRule":
      return stringifyCSSStyleRule(rule);
  }
};

const stringifyCSSStyleRule = ({ selector_text, style }) => {
  return `${selector_text} {
    ${style.map(stringifyStyle).join("\n")}
  }`;
};

const stringifyStyle = ({ name, value }) => `${name}:${value};`;
