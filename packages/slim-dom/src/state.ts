export enum NodeType {
  ELEMENT = 1,
  TEXT= 3,
  DOCUMENT = 9,
  DOCUMENT_FRAGMENT = 11,
};

// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants
export enum CSSRuleType {
  STYLE_SHEET = 99,
  STYLE_RULE = 1,
  MEDIA_RULE = 4,
  FONT_FACE_RULE = 5,
  KEYFRAME_RULE = 7,
  UNKNOWN_RULE = 0,
};

export type SourcePosition = {
  line: number;
  column: number;
  pos: number;
};

export type SourceRange = {
  start: SourcePosition;
  end: SourcePosition;
};

export type VMObjectSource = {
  type?: string|number;
  uri: string;
  range: SourceRange;
};

export type VMObject = {
  id: any;
  type: any;

  // the sourc of the VM Object
  source: VMObjectSource;
};

export type BaseNode = {
  type: NodeType;
} & VMObject;

export type ParentNode = {
  childNodes: BaseNode[];
} & BaseNode;

export type TextNode = {
  value: string;
} & BaseNode;

export type Fragment = {

} & BaseNode;

export type ElementAttribute = {
  name: string;
  value: any;
};

export type Element = {
  tagName: string;
  attributes: ElementAttribute[];
  shadow: ParentNode;
} & ParentNode;

export type StyleElement = {
  sheet: CSSStyleSheet;
} & Element;

export type CSSStyleSheet = {
  rules: CSSRule[];
} & VMObject;

export type CSSRule = {
  type: CSSRuleType;
} & VMObject;

export type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type CSSStyleRule = {
  selectorText: string;
  style: CSSStyleDeclaration;
} & CSSRule;

export type CSSGroupingRule = {
  rules: CSSRule[];
} & CSSRule;

export type CSSMediaRule = {
  conditionText: string;
} & CSSGroupingRule;

export type CSSStyleDeclaration = {
  id: string;
  alignContent: string | null;
  alignItems: string | null;
  alignmentBaseline: string | null;
  alignSelf: string | null;
  animation: string | null;
  animationDelay: string | null;
  animationDirection: string | null;
  animationDuration: string | null;
  animationFillMode: string | null;
  animationIterationCount: string | null;
  animationName: string | null;
  animationPlayState: string | null;
  animationTimingFunction: string | null;
  backfaceVisibility: string | null;
  background: string | null;
  backgroundAttachment: string | null;
  backgroundClip: string | null;
  backgroundColor: string | null;
  backgroundImage: string | null;
  backgroundOrigin: string | null;
  backgroundPosition: string | null;
  backgroundPositionX: string | null;
  backgroundPositionY: string | null;
  backgroundRepeat: string | null;
  backgroundSize: string | null;
  baselineShift: string | null;
  border: string | null;
  borderBottom: string | null;
  borderBottomColor: string | null;
  borderBottomLeftRadius: string | null;
  borderBottomRightRadius: string | null;
  borderBottomStyle: string | null;
  borderBottomWidth: string | null;
  borderCollapse: string | null;
  borderColor: string | null;
  borderImage: string | null;
  borderImageOutset: string | null;
  borderImageRepeat: string | null;
  borderImageSlice: string | null;
  borderImageSource: string | null;
  borderImageWidth: string | null;
  borderLeft: string | null;
  borderLeftColor: string | null;
  borderLeftStyle: string | null;
  borderLeftWidth: string | null;
  borderRadius: string | null;
  borderRight: string | null;
  borderRightColor: string | null;
  borderRightStyle: string | null;
  borderRightWidth: string | null;
  borderSpacing: string | null;
  borderStyle: string | null;
  borderTop: string | null;
  borderTopColor: string | null;
  borderTopLeftRadius: string | null;
  borderTopRightRadius: string | null;
  borderTopStyle: string | null;
  borderTopWidth: string | null;
  borderWidth: string | null;
  bottom: string | null;
  boxShadow: string | null;
  boxSizing: string | null;
  breakAfter: string | null;
  breakBefore: string | null;
  breakInside: string | null;
  captionSide: string | null;
  clear: string | null;
  clip: string | null;
  clipPath: string | null;
  clipRule: string | null;
  color: string | null;
  colorInterpolationFilters: string | null;
  columnCount: any;
  columnFill: string | null;
  columnGap: any;
  columnRule: string | null;
  columnRuleColor: any;
  columnRuleStyle: string | null;
  columnRuleWidth: any;
  columns: string | null;
  columnSpan: string | null;
  columnWidth: any;
  content: string | null;
  counterIncrement: string | null;
  counterReset: string | null;
  cssFloat: string | null;
  cursor: string | null;
  direction: string | null;
  display: string | null;
  dominantBaseline: string | null;
  emptyCells: string | null;
  enableBackground: string | null;
  fill: string | null;
  fillOpacity: string | null;
  fillRule: string | null;
  filter: string | null;
  flex: string | null;
  flexBasis: string | null;
  flexDirection: string | null;
  flexFlow: string | null;
  flexGrow: string | null;
  flexShrink: string | null;
  flexWrap: string | null;
  floodColor: string | null;
  floodOpacity: string | null;
  font: string | null;
  fontFamily: string | null;
  fontFeatureSettings: string | null;
  fontSize: string | null;
  fontSizeAdjust: string | null;
  fontStretch: string | null;
  fontStyle: string | null;
  fontVariant: string | null;
  fontWeight: string | null;
  glyphOrientationHorizontal: string | null;
  glyphOrientationVertical: string | null;
  height: string | null;
  imeMode: string | null;
  justifyContent: string | null;
  kerning: string | null;
  layoutGrid: string | null;
  layoutGridChar: string | null;
  layoutGridLine: string | null;
  layoutGridMode: string | null;
  layoutGridType: string | null;
  left: string | null;
  letterSpacing: string | null;
  lightingColor: string | null;
  lineBreak: string | null;
  lineHeight: string | null;
  listStyle: string | null;
  listStyleImage: string | null;
  listStylePosition: string | null;
  listStyleType: string | null;
  margin: string | null;
  marginBottom: string | null;
  marginLeft: string | null;
  marginRight: string | null;
  marginTop: string | null;
  marker: string | null;
  markerEnd: string | null;
  markerMid: string | null;
  markerStart: string | null;
  mask: string | null;
  maxHeight: string | null;
  maxWidth: string | null;
  minHeight: string | null;
  minWidth: string | null;
  msContentZoomChaining: string | null;
  msContentZooming: string | null;
  msContentZoomLimit: string | null;
  msContentZoomLimitMax: any;
  msContentZoomLimitMin: any;
  msContentZoomSnap: string | null;
  msContentZoomSnapPoints: string | null;
  msContentZoomSnapType: string | null;
  msFlowFrom: string | null;
  msFlowInto: string | null;
  msFontFeatureSettings: string | null;
  msGridColumn: any;
  msGridColumnAlign: string | null;
  msGridColumns: string | null;
  msGridColumnSpan: any;
  msGridRow: any;
  msGridRowAlign: string | null;
  msGridRows: string | null;
  msGridRowSpan: any;
  msHighContrastAdjust: string | null;
  msHyphenateLimitChars: string | null;
  msHyphenateLimitLines: any;
  msHyphenateLimitZone: any;
  msHyphens: string | null;
  msImeAlign: string | null;
  msOverflowStyle: string | null;
  msScrollChaining: string | null;
  msScrollLimit: string | null;
  msScrollLimitXMax: any;
  msScrollLimitXMin: any;
  msScrollLimitYMax: any;
  msScrollLimitYMin: any;
  msScrollRails: string | null;
  msScrollSnapPointsX: string | null;
  msScrollSnapPointsY: string | null;
  msScrollSnapType: string | null;
  msScrollSnapX: string | null;
  msScrollSnapY: string | null;
  msScrollTranslation: string | null;
  msTextCombineHorizontal: string | null;
  msTextSizeAdjust: any;
  msTouchAction: string | null;
  msTouchSelect: string | null;
  msUserSelect: string | null;
  msWrapFlow: string;
  msWrapMargin: any;
  msWrapThrough: string;
  opacity: string | null;
  order: string | null;
  orphans: string | null;
  outline: string | null;
  outlineColor: string | null;
  outlineOffset: string | null;
  outlineStyle: string | null;
  outlineWidth: string | null;
  overflow: string | null;
  overflowX: string | null;
  overflowY: string | null;
  padding: string | null;
  paddingBottom: string | null;
  paddingLeft: string | null;
  paddingRight: string | null;
  paddingTop: string | null;
  pageBreakAfter: string | null;
  pageBreakBefore: string | null;
  pageBreakInside: string | null;
  perspective: string | null;
  perspectiveOrigin: string | null;
  pointerEvents: string | null;
  position: string | null;
  quotes: string | null;
  right: string | null;
  rotate: string | null;
  rubyAlign: string | null;
  rubyOverhang: string | null;
  rubyPosition: string | null;
  scale: string | null;
  stopColor: string | null;
  stopOpacity: string | null;
  stroke: string | null;
  strokeDasharray: string | null;
  strokeDashoffset: string | null;
  strokeLinecap: string | null;
  strokeLinejoin: string | null;
  strokeMiterlimit: string | null;
  strokeOpacity: string | null;
  strokeWidth: string | null;
  tableLayout: string | null;
  textAlign: string | null;
  textAlignLast: string | null;
  textAnchor: string | null;
  textDecoration: string | null;
  textIndent: string | null;
  textJustify: string | null;
  textKashida: string | null;
  textKashidaSpace: string | null;
  textOverflow: string | null;
  textShadow: string | null;
  textTransform: string | null;
  textUnderlinePosition: string | null;
  top: string | null;
  touchAction: string | null;
  transform: string | null;
  transformOrigin: string | null;
  transformStyle: string | null;
  transition: string | null;
  transitionDelay: string | null;
  transitionDuration: string | null;
  transitionProperty: string | null;
  transitionTimingFunction: string | null;
  translate: string | null;
  unicodeBidi: string | null;
  verticalAlign: string | null;
  visibility: string | null;
  webkitAlignContent: string | null;
  webkitAlignItems: string | null;
  webkitAlignSelf: string | null;
  webkitAnimation: string | null;
  webkitAnimationDelay: string | null;
  webkitAnimationDirection: string | null;
  webkitAnimationDuration: string | null;
  webkitAnimationFillMode: string | null;
  webkitAnimationIterationCount: string | null;
  webkitAnimationName: string | null;
  webkitAnimationPlayState: string | null;
  webkitAnimationTimingFunction: string | null;
  webkitAppearance: string | null;
  webkitBackfaceVisibility: string | null;
  webkitBackgroundClip: string | null;
  webkitBackgroundOrigin: string | null;
  webkitBackgroundSize: string | null;
  webkitBorderBottomLeftRadius: string | null;
  webkitBorderBottomRightRadius: string | null;
  webkitBorderImage: string | null;
  webkitBorderRadius: string | null;
  webkitBorderTopLeftRadius: string | null;
  webkitBorderTopRightRadius: string | null;
  webkitBoxAlign: string | null;
  webkitBoxDirection: string | null;
  webkitBoxFlex: string | null;
  webkitBoxOrdinalGroup: string | null;
  webkitBoxOrient: string | null;
  webkitBoxPack: string | null;
  webkitBoxSizing: string | null;
  webkitColumnBreakAfter: string | null;
  webkitColumnBreakBefore: string | null;
  webkitColumnBreakInside: string | null;
  webkitColumnCount: any;
  webkitColumnGap: any;
  webkitColumnRule: string | null;
  webkitColumnRuleColor: any;
  webkitColumnRuleStyle: string | null;
  webkitColumnRuleWidth: any;
  webkitColumns: string | null;
  webkitColumnSpan: string | null;
  webkitColumnWidth: any;
  webkitFilter: string | null;
  webkitFlex: string | null;
  webkitFlexBasis: string | null;
  webkitFlexDirection: string | null;
  webkitFlexFlow: string | null;
  webkitFlexGrow: string | null;
  webkitFlexShrink: string | null;
  webkitFlexWrap: string | null;
  webkitJustifyContent: string | null;
  webkitOrder: string | null;
  webkitPerspective: string | null;
  webkitPerspectiveOrigin: string | null;
  webkitTapHighlightColor: string | null;
  webkitTextFillColor: string | null;
  webkitTextSizeAdjust: any;
  webkitTextStroke: string | null;
  webkitTextStrokeColor: string | null;
  webkitTextStrokeWidth: string | null;
  webkitTransform: string | null;
  webkitTransformOrigin: string | null;
  webkitTransformStyle: string | null;
  webkitTransition: string | null;
  webkitTransitionDelay: string | null;
  webkitTransitionDuration: string | null;
  webkitTransitionProperty: string | null;
  webkitTransitionTimingFunction: string | null;
  webkitUserModify: string | null;
  webkitUserSelect: string | null;
  webkitWritingMode: string | null;
  whiteSpace: string | null;
  widows: string | null;
  width: string | null;
  wordBreak: string | null;
  wordSpacing: string | null;
  wordWrap: string | null;
  writingMode: string | null;
  zIndex: string | null;
  zoom: string | null;
  resize: string | null;
  userSelect: string | null;
  [index: number]: string;
} & VMObject;