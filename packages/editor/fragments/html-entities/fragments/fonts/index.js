import FontFragment from './font';

// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
const DEFAULT_WEIGHTS = [
  100, // Thin
  200, // Extra Light
  300, // Light
  400, // Normal
  500, // Medium
  600, // Demi bold
  700, // Bold
  800, // Ultra Bold
  900, // Heavy
]

const DEFAULT_STYLES = [
  'normal',
  'italic'

  // unnecessary for now. Maybe later on.
  // 'oblique',
  // 'initial',
  // 'inherit'
];

const DEFAULT_DECORATIONS = [
  'none', 'underline', 'overline', 'line-through', 'initial', 'inherit'
];

export function create({ app }) {
  return [
    'Lucida Grande',
    'Helvetica',
    'Arial',
    'Comic Sans MS'
  ].map(function(fontName) {
    return FontFragment.create(
      fontName,
      DEFAULT_WEIGHTS,
      DEFAULT_STYLES,
      DEFAULT_DECORATIONS
    );
  });
}
