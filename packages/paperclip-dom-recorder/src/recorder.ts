import {
  PCNode,
  PCModule,
  createPCModule,
  updatePCNodeMetadata,
  PCVisibleNodeMetadataKey,
  PCSourceTagNames,
  PCElement,
  createPCTextNode,
  createPCElement,
  PCBaseElementChild,
  PCVisibleNode,
  createPCVariable,
  PCVariableType,
  PCVariable,
  CSS_COLOR_ALIASES,
  PCTextStyleMixin,
  createPCTextStyleMixin
} from "paperclip";
import {
  appendChildNode,
  EMPTY_ARRAY,
  KeyValue,
  EMPTY_OBJECT
} from "tandem-common";
import { normalize } from "path";

const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 900;
const MAX_LABEL_LENGTH = 10;

const BLACKLIST_ATTRIBUTES = {
  style: true,
  class: true,
  id: true,
  autofocus: true
};

const FRAME_PADDING = 50;

const BLACKLIST_TAG_NAMES = {
  style: true,
  script: true,
  link: true
};

export const TYPOGRAPHY_STYLE_NAMES = [
  "color",
  "font-family",
  "font-size",
  "font-style",
  "font-variant",
  "font-weight",
  "font",
  "letter-spacing",
  "line-height",
  "text-align",
  "text-indent",
  "text-transform",
  "white-space",
  "word-spacing"
];

const LOG_PREFIX = "[Paperclip DOM Recorder] ";

export class PCDOMRecorder {
  private _target: HTMLElement = document.body;
  private _domObserver: MutationObserver;
  private _snapshotRoot: PCModule = createPCModule();

  public start() {
    this.stop();
    console.log(LOG_PREFIX + "running");
    this.takeSnapshot();
    this._domObserver = new MutationObserver(this.onDOMChanges);
    this._domObserver.observe(this._target, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  public stop() {
    if (this._domObserver) {
      console.log(LOG_PREFIX + "stopped");
      this._domObserver.disconnect();
      this._domObserver = undefined;
    }
  }

  public print() {
    console.log(JSON.stringify(this.prepareSnapshotRoot(), null, 2));
  }

  public copy() {
    window["copy"](JSON.stringify(this.prepareSnapshotRoot(), null, 2));
    console.log(
      LOG_PREFIX +
        "%cCopied module content to clipboard. You can now paste to a *.pc file: %cpbpaste > my-module.pc",
      "font-weight: bold;",
      "color: maroon; font-weight: bold;"
    );
  }

  private prepareSnapshotRoot = () => {
    let root = this._snapshotRoot;
    root = elevateCommonStylesToGlobal(root);
    return root;
  };

  private onDOMChanges = () => {
    this.takeSnapshot();
  };

  public takeSnapshot() {
    this._snapshotRoot = addDOMSnapshot(this._target, this._snapshotRoot);
    console.log(LOG_PREFIX + "Added snapshot");
  }
}

const addDOMSnapshot = (node: HTMLElement, root: PCModule): PCModule => {
  const existingSnapshots = root.children.filter(
    child => child.name === PCSourceTagNames.ELEMENT
  );
  const lastSnapshot = existingSnapshots[existingSnapshots.length - 1];
  const lastSnapshotRight =
    (lastSnapshot &&
      lastSnapshot.metadata[PCVisibleNodeMetadataKey.BOUNDS].right +
        FRAME_PADDING) ||
    0;

  // 1 convert DOM to PC & append to root
  let newSnapshot = convertDOMToPC(node) as PCElement;

  newSnapshot = {
    ...newSnapshot,
    label: `Snapshot ${existingSnapshots.length + 1}`
  };

  // move snapshot to right of previous frame
  newSnapshot = updatePCNodeMetadata(
    {
      [PCVisibleNodeMetadataKey.BOUNDS]: {
        left: lastSnapshotRight,
        right: lastSnapshotRight + FRAME_WIDTH,
        top: 0,
        bottom: FRAME_HEIGHT
      }
    },
    newSnapshot
  );

  root = appendChildNode(newSnapshot, root);

  // 2 collect typography styles
  // 3 collect colors

  return root;
};

const convertDOMChildrenToPC = (node: HTMLElement): PCBaseElementChild[] => {
  return Array.prototype.map
    .call(node.childNodes, child => convertDOMToPC(child))
    .filter(Boolean);
};

const convertDOMToPC = (node: Node): PCNode => {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE: {
      const element = node as HTMLElement;
      const attributes = getElementAttributes(element);
      const children = convertDOMChildrenToPC(element);
      let tagName = element.tagName.toLowerCase();
      if (BLACKLIST_TAG_NAMES[tagName]) {
        return null;
      }
      if (tagName === "body") {
        tagName = "div";
      }
      let pcElement = createPCElement(
        tagName,
        computeStyle(element),
        attributes,
        children,
        tagName
      );
      return pcElement;
    }
    case Node.TEXT_NODE: {
      const text = node as Text;
      const nodeValue = String(text.nodeValue);
      if (/^[\s\n\t]+$/.test(nodeValue)) {
        return null;
      }
      let pcTextNode = createPCTextNode(nodeValue, trimLabel(nodeValue));
      return pcTextNode;
    }
    case Node.COMMENT_NODE: {
      return null;
    }
    default: {
      console.warn(`Unknown DOM node type ${node.nodeType}`);
    }
  }
  return null;
};

const elevateCommonStylesToGlobal = (root: PCModule) => {
  root = elevateColorsToGlobal(root);

  // don't do this for now because it causes messiness. Instead focus on
  // tooling that makes it easier to elevate typography to mixins.
  // root = elevateTypographyToMixins(root);
  return root;
};

const elevateColorsToGlobal = (root: PCModule) => {
  const colorVarMap: KeyValue<PCVariable> = {};
  const moveColorsToMap = (node: PCNode) => {
    if (
      node.name === PCSourceTagNames.ELEMENT ||
      node.name === PCSourceTagNames.TEXT
    ) {
      let newStyle;
      for (const key in node.style) {
        let value: string = node.style[key];
        const colors = findCSSColors(node.style[key]);
        if (colors.length) {
          if (!newStyle) {
            newStyle = { ...node.style };
          }

          for (const color of colors) {
            const colorVar: PCVariable =
              colorVarMap[color] ||
              (colorVarMap[color] = createPCVariable(
                `Color ${Object.keys(colorVarMap).length + 1}`,
                PCVariableType.COLOR,
                color
              ));
            value = value.replace(color, `var(--${colorVar.id})`);
          }

          newStyle[key] = value;
        }
      }

      if (newStyle) {
        node = {
          ...node,
          style: newStyle
        };
      }
    }

    if (node.children.length) {
      return {
        ...node,
        children: node.children.map(moveColorsToMap)
      };
    }

    return node;
  };
  root = moveColorsToMap(root);

  for (const color in colorVarMap) {
    const pcVar = colorVarMap[color];
    root = appendChildNode(pcVar, root);
  }

  return root;
};

const elevateTypographyToMixins = (root: PCModule) => {
  const typographyMixinMap: KeyValue<PCTextStyleMixin> = {};

  const moveTypographyToMap = (node: PCNode) => {
    if (
      node.name === PCSourceTagNames.ELEMENT ||
      node.name === PCSourceTagNames.TEXT
    ) {
      const typographyStyle = {};
      const otherStyle = {};
      for (const key in node.style) {
        if (TYPOGRAPHY_STYLE_NAMES.indexOf(key) !== -1) {
          typographyStyle[key] = node.style[key];
        } else {
          otherStyle[key] = node.style[key];
        }
      }
      if (Object.keys(typographyStyle).length) {
        const key = JSON.stringify(typographyStyle);
        const mixin =
          typographyMixinMap[key] ||
          (typographyMixinMap[key] = createPCTextStyleMixin(
            typographyStyle,
            `Text Style ${Object.keys(typographyStyle).length + 1}`
          ));
        node = {
          ...node,
          style: otherStyle,
          styleMixins: {
            ...(node.styleMixins || EMPTY_OBJECT),
            [mixin.id]: {
              priority: 1
            }
          }
        };
      }
    }

    if (node.children.length) {
      return {
        ...node,
        children: node.children.map(moveTypographyToMap)
      };
    }

    return node;
  };

  root = moveTypographyToMap(root);

  let i = 0;

  for (const key in typographyMixinMap) {
    let mixin = typographyMixinMap[key];
    const size = 100;
    const left = i++ * (size + FRAME_PADDING);
    const top = -(size + FRAME_PADDING);
    mixin = {
      ...mixin,
      metadata: {
        ...mixin.metadata,
        [PCVisibleNodeMetadataKey.BOUNDS]: {
          left,
          top,
          right: left + size,
          bottom: top + size
        }
      }
    };

    root = appendChildNode(mixin, root);
  }

  return root;
};

const COLOR_REGEXP = new RegExp(
  `(rgba?|hsla?)\\(.*?\\)|#[^\\s]+|${Object.keys(CSS_COLOR_ALIASES).join("|")}`,
  "gi"
);

// TODO - need to get map of all css colors
const findCSSColors = (value: string) => {
  return String(value).match(COLOR_REGEXP) || EMPTY_ARRAY;
};

const trimLabel = (label: string) => {
  return label.length > MAX_LABEL_LENGTH ? label.substr(0, 10) + "..." : label;
};

const computeStyle = (element: HTMLElement) => {
  const computedStyle = {};

  for (let i = 0, { length } = document.styleSheets; i < length; i++) {
    Object.assign(
      computedStyle,
      computeGroupingRule(element, document.styleSheets[i] as CSSStyleSheet)
    );
  }

  if (element.hasAttribute("style")) {
    Object.assign(computedStyle, parseStyle(element.getAttribute("style")));
  }

  return normalizeStyleProps(computedStyle);
};

const normalizeStyleProps = (style: any) => {
  const normalizedStyle = {};

  for (const key in style) {
    const value = style[key];
    if (key === "font") {
      const fontParts = value.replace(",", "").match(/["'].*?["']|[^\s]+/g);
      for (const part of fontParts) {
        if (/em|px|pt/.test(part)) {
          const [fontSize, lineHeight] = part.split("/");
          normalizedStyle["font-size"] = fontSize;
          normalizedStyle["line-height"] = lineHeight;
        } else if (/["']/.test(part)) {
          normalizedStyle["font-family"] = part.substr(1, part.length - 2);
        } else if (/\d{3}/.test(part)) {
          normalizedStyle["font-weight"] = part;
        }
      }

      console.log(fontParts, normalizedStyle);
    } else {
      normalizedStyle[key] = value;
    }
  }

  return normalizedStyle;
};

const computeGroupingRule = (
  element: HTMLElement,
  group: CSSGroupingRule | CSSStyleSheet
) => {
  const computedStyle = {};

  const matches = element.matches || element.webkitMatchesSelector;
  try {
    for (let i = 0, { length } = group.cssRules; i < length; i++) {
      const rule = group.cssRules[i];
      if (rule.type === CSSRule.STYLE_RULE) {
        if (matches.call(element, (rule as CSSStyleRule).selectorText)) {
          Object.assign(
            computedStyle,
            parseStyle((rule as CSSStyleRule).cssText.match(/{(.*?)}/)[1])
          );
        }
      } else if (
        rule.type === CSSRule.MEDIA_RULE &&
        window.matchMedia((rule as CSSMediaRule).conditionText)
      ) {
        Object.assign(
          computedStyle,
          computeGroupingRule(element, rule as CSSMediaRule)
        );
      }
    }
  } catch (e) {
    console.error(e);
  }

  return computedStyle;
};

const getElementAttributes = (element: HTMLElement) => {
  const attributes = {};
  for (let i = 0, { length } = element.attributes; i < length; i++) {
    const attr = element.attributes[i];
    const name = attr.name.toLowerCase();
    if (BLACKLIST_ATTRIBUTES[name] || /^data\-/.test(name)) {
      continue;
    }
    attributes[name] = attr.value;
  }
  return attributes;
};

const parseStyle = (value: string) => {
  return value.split(/\s*;\s*/g).reduce((style, part) => {
    const [key, value] = part.split(/\s*:\s*/);
    if (!key || !value) {
      return style;
    }
    return {
      ...style,
      [key.trim()]: value.trim()
    };
  }, {});
};
