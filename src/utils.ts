/**
 * HCNC (Hikasami CSS Naming Convention) Utilities
 *
 * Naming Rules:
 * - Block: lowercase/kebab-case (card, button, header-nav)
 * - Element L1: block_element (card_info, button_icon)
 * - Element L2: block_element__nested (card_info__title)
 * - Modifier: block--modifier (card--highlighted)
 * - State: is/has + PascalCase (isActive, hasError)
 * - Utility: atomic classes (mt-2, flex, text-sm)
 */

// =============================================================================
// Types
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  type: HcncClassType | null;
  message?: string;
}

export type HcncClassType =
  | 'block'
  | 'element'
  | 'nested-element'
  | 'modifier'
  | 'state'
  | 'utility';

export interface HcncConfig {
  /** Additional utility class patterns (regex strings) */
  customUtilities?: string[];
  /** Allow unknown classes without error */
  allowUnknown?: boolean;
  /** Strict mode - no utilities allowed */
  strictBem?: boolean;
}

// =============================================================================
// Regex Patterns
// =============================================================================

/**
 * Block pattern: lowercase letters, numbers, hyphens
 * Examples: card, button, header-nav, user-profile
 */
const BLOCK_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/**
 * Element pattern: block_element
 * Examples: card_info, button_icon, header_nav
 */
const ELEMENT_PATTERN =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*_[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/**
 * Nested element pattern: block_element__nested
 * Examples: card_info__title, card_info__description
 */
const NESTED_ELEMENT_PATTERN =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*_[a-z][a-z0-9]*(?:-[a-z0-9]+)*__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/**
 * Modifier pattern: block--modifier or block_element--modifier
 * Examples: card--highlighted, button--large, card_info--active
 */
const MODIFIER_PATTERN =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:_[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?--[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/**
 * State pattern: is/has + PascalCase
 * Examples: isActive, hasError, isLoading, hasItems
 */
const STATE_PATTERN = /^(is|has)[A-Z][a-zA-Z0-9]*$/;

/**
 * Common utility patterns (Tailwind-like)
 */
const UTILITY_PATTERNS = [
  // Flexbox
  /^flex$/,
  /^inline-flex$/,
  /^flex-(row|col|wrap|nowrap|1|auto|initial|none)$/,
  /^flex-(row|col)-reverse$/,
  /^items-(start|end|center|baseline|stretch)$/,
  /^justify-(start|end|center|between|around|evenly)$/,
  /^self-(auto|start|end|center|stretch|baseline)$/,
  /^grow(-0)?$/,
  /^shrink(-0)?$/,
  /^order-\d+$/,

  // Grid
  /^grid$/,
  /^inline-grid$/,
  /^grid-cols-\d+$/,
  /^grid-rows-\d+$/,
  /^col-span-\d+$/,
  /^row-span-\d+$/,
  /^gap-\d+$/,
  /^gap-x-\d+$/,
  /^gap-y-\d+$/,

  // Spacing (margin, padding)
  /^[mp][trblxy]?-\d+(\.\d+)?$/,
  /^-[mp][trblxy]?-\d+(\.\d+)?$/,
  /^space-[xy]-\d+$/,
  /^-space-[xy]-\d+$/,

  // Sizing
  /^[wh]-(full|screen|auto|min|max|fit|\d+(\.\d+)?|(\d+\/\d+))$/,
  /^min-[wh]-(full|screen|0|\d+(\.\d+)?)$/,
  /^max-[wh]-(full|screen|none|\d+(\.\d+)?)$/,
  /^size-\d+$/,

  // Typography
  /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
  /^text-(left|center|right|justify|start|end)$/,
  /^text-\[.+\]$/, // Arbitrary values
  /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  /^font-(sans|serif|mono)$/,
  /^leading-(none|tight|snug|normal|relaxed|loose|\d+)$/,
  /^tracking-(tighter|tight|normal|wide|wider|widest)$/,
  /^uppercase$/,
  /^lowercase$/,
  /^capitalize$/,
  /^normal-case$/,
  /^italic$/,
  /^not-italic$/,
  /^underline$/,
  /^overline$/,
  /^line-through$/,
  /^no-underline$/,
  /^truncate$/,
  /^whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)$/,
  /^break-(normal|words|all|keep)$/,

  // Colors (simplified - matches common patterns)
  /^(text|bg|border|ring|shadow)-(transparent|current|inherit)$/,
  /^(text|bg|border|ring)-(black|white)$/,
  /^(text|bg|border|ring)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/,
  /^(text|bg|border|ring)-\[#[0-9a-fA-F]{3,8}\]$/,
  /^(text|bg|border|ring)-\[rgb.+\]$/,

  // Backgrounds
  /^bg-(fixed|local|scroll)$/,
  /^bg-(bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top)$/,
  /^bg-(repeat|no-repeat|repeat-x|repeat-y|repeat-round|repeat-space)$/,
  /^bg-(auto|cover|contain)$/,
  /^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)$/,
  /^from-\w+(-\d+)?$/,
  /^via-\w+(-\d+)?$/,
  /^to-\w+(-\d+)?$/,

  // Borders
  /^border(-[trblxy])?(-\d+)?$/,
  /^border-(solid|dashed|dotted|double|hidden|none)$/,
  /^rounded(-[trblxy])?(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
  /^divide-[xy](-\d+)?$/,
  /^divide-(solid|dashed|dotted|double|none)$/,
  /^ring(-\d+)?$/,
  /^ring-inset$/,
  /^ring-offset-\d+$/,

  // Effects
  /^shadow(-sm|-md|-lg|-xl|-2xl|-inner|-none)?$/,
  /^opacity-\d+$/,
  /^mix-blend-\w+$/,
  /^bg-blend-\w+$/,

  // Filters
  /^blur(-sm|-md|-lg|-xl|-2xl|-3xl|-none)?$/,
  /^brightness-\d+$/,
  /^contrast-\d+$/,
  /^grayscale(-0)?$/,
  /^hue-rotate-\d+$/,
  /^-hue-rotate-\d+$/,
  /^invert(-0)?$/,
  /^saturate-\d+$/,
  /^sepia(-0)?$/,
  /^drop-shadow(-sm|-md|-lg|-xl|-2xl|-none)?$/,
  /^backdrop-blur(-sm|-md|-lg|-xl|-2xl|-3xl|-none)?$/,

  // Layout
  /^block$/,
  /^inline-block$/,
  /^inline$/,
  /^hidden$/,
  /^contents$/,
  /^flow-root$/,
  /^list-item$/,
  /^list-(none|disc|decimal)$/,
  /^float-(left|right|none)$/,
  /^clear-(left|right|both|none)$/,
  /^object-(contain|cover|fill|none|scale-down)$/,
  /^object-(bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top)$/,
  /^overflow(-[xy])?-(auto|hidden|clip|visible|scroll)$/,
  /^overscroll(-[xy])?-(auto|contain|none)$/,

  // Positioning
  /^(static|fixed|absolute|relative|sticky)$/,
  /^(top|right|bottom|left|inset)(-[xy])?-\d+(\.\d+)?$/,
  /^-(top|right|bottom|left|inset)(-[xy])?-\d+(\.\d+)?$/,
  /^(top|right|bottom|left|inset)(-[xy])?-(auto|full|1\/2)$/,
  /^z-\d+$/,
  /^z-(auto)$/,
  /^-z-\d+$/,

  // Transforms
  /^scale(-[xy])?-\d+$/,
  /^rotate-\d+$/,
  /^-rotate-\d+$/,
  /^translate-[xy]-\d+(\.\d+)?$/,
  /^-translate-[xy]-\d+(\.\d+)?$/,
  /^skew-[xy]-\d+$/,
  /^-skew-[xy]-\d+$/,
  /^origin-(center|top|top-right|right|bottom-right|bottom|bottom-left|left|top-left)$/,
  /^transform$/,
  /^transform-none$/,
  /^transform-gpu$/,

  // Transitions & Animation
  /^transition(-all|-colors|-opacity|-shadow|-transform|-none)?$/,
  /^duration-\d+$/,
  /^ease-(linear|in|out|in-out)$/,
  /^delay-\d+$/,
  /^animate-(none|spin|ping|pulse|bounce)$/,

  // Interactivity
  /^cursor-(auto|default|pointer|wait|text|move|help|not-allowed|none|context-menu|progress|cell|crosshair|vertical-text|alias|copy|no-drop|grab|grabbing|all-scroll|col-resize|row-resize|n-resize|e-resize|s-resize|w-resize|ne-resize|nw-resize|se-resize|sw-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|zoom-in|zoom-out)$/,
  /^resize(-none|-x|-y)?$/,
  /^select-(none|text|all|auto)$/,
  /^pointer-events-(none|auto)$/,
  /^touch-(auto|none|pan-x|pan-left|pan-right|pan-y|pan-up|pan-down|pinch-zoom|manipulation)$/,
  /^scroll-(auto|smooth)$/,
  /^scroll-[mp][trblxy]?-\d+$/,
  /^snap-(start|end|center|align-none)$/,
  /^snap-(normal|always)$/,
  /^snap-(none|x|y|both|mandatory|proximity)$/,
  /^appearance-none$/,
  /^outline(-none|-dashed|-dotted|-double)?$/,
  /^outline-\d+$/,
  /^outline-offset-\d+$/,
  /^accent-\w+(-\d+)?$/,
  /^caret-\w+(-\d+)?$/,
  /^will-change-(auto|scroll|contents|transform)$/,

  // Accessibility
  /^sr-only$/,
  /^not-sr-only$/,
  /^forced-color-adjust-(auto|none)$/,

  // Tables
  /^table(-auto|-fixed)?$/,
  /^table-(caption|cell|column|column-group|footer-group|header-group|row-group|row)$/,
  /^border-(collapse|separate)$/,
  /^border-spacing(-[xy])?-\d+$/,
  /^caption-(top|bottom)$/,

  // SVG
  /^fill-(none|inherit|current|\w+(-\d+)?)$/,
  /^stroke-(none|inherit|current|\w+(-\d+)?)$/,
  /^stroke-\d+$/,

  // Aspect ratio
  /^aspect-(auto|square|video)$/,
  /^aspect-\[\d+\/\d+\]$/,

  // Columns
  /^columns-\d+$/,
  /^columns-(auto|3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)$/,
  /^break-(before|after|inside)-(auto|avoid|all|avoid-page|page|left|right|column)$/,

  // Box decoration
  /^box-(border|content)$/,
  /^decoration-(clone|slice)$/,
  /^isolation-(auto|isolate)$/,

  // Container
  /^container$/,
  /^mx-auto$/,

  // Visibility
  /^visible$/,
  /^invisible$/,
  /^collapse$/,
];

// =============================================================================
// Validation Functions
// =============================================================================

/**
 * Check if a class name is a valid HCNC block
 */
export function isBlock(className: string): boolean {
  return BLOCK_PATTERN.test(className);
}

/**
 * Check if a class name is a valid HCNC element (level 1)
 */
export function isElement(className: string): boolean {
  return ELEMENT_PATTERN.test(className);
}

/**
 * Check if a class name is a valid HCNC nested element (level 2)
 */
export function isNestedElement(className: string): boolean {
  return NESTED_ELEMENT_PATTERN.test(className);
}

/**
 * Check if a class name is a valid HCNC modifier
 */
export function isModifier(className: string): boolean {
  return MODIFIER_PATTERN.test(className);
}

/**
 * Check if a class name is a valid HCNC state (isActive, hasError)
 */
export function isStateClass(className: string): boolean {
  return STATE_PATTERN.test(className);
}

/**
 * Check if a class name is a valid utility class
 */
export function isUtilityClass(
  className: string,
  customPatterns?: string[],
): boolean {
  // Check built-in patterns
  for (const pattern of UTILITY_PATTERNS) {
    if (pattern.test(className)) {
      return true;
    }
  }

  // Check custom patterns
  if (customPatterns) {
    for (const patternStr of customPatterns) {
      const pattern = new RegExp(patternStr);
      if (pattern.test(className)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a class name is a valid HCNC BEM class (block, element, or modifier)
 * Note: This excludes states and utilities which are valid in HCNC but not BEM
 */
export function isHcncClass(className: string): boolean {
  // Exclude utilities - they match block pattern but are not BEM classes
  if (isUtilityClass(className)) return false;

  return (
    isBlock(className) ||
    isElement(className) ||
    isNestedElement(className) ||
    isModifier(className)
  );
}

/**
 * Get the type of a class name
 *
 * Check order:
 * 1. States (isActive, hasError) - most specific pattern
 * 2. Modifiers (block--mod) - contains --
 * 3. Nested elements (block_el__nested) - contains __
 * 4. Elements (block_el) - contains single _
 * 5. Utilities (mt-2, flex) - checked BEFORE blocks because they overlap
 * 6. Blocks (card, button) - most general pattern
 */
export function getClassType(
  className: string,
  config?: HcncConfig,
): HcncClassType | null {
  if (isStateClass(className)) return 'state';
  if (isModifier(className)) return 'modifier';
  if (isNestedElement(className)) return 'nested-element';
  if (isElement(className)) return 'element';

  // Check utilities BEFORE blocks because patterns overlap (e.g., "flex" matches both)
  const isUtility = isUtilityClass(className, config?.customUtilities);

  if (isUtility) {
    // In strictBem mode, reject utilities
    if (config?.strictBem) return null;
    return 'utility';
  }

  if (isBlock(className)) return 'block';
  return null;
}

/**
 * Validate a single class name
 */
export function validateClassName(
  className: string,
  config?: HcncConfig,
): ValidationResult {
  const type = getClassType(className, config);

  if (type) {
    return { valid: true, type };
  }

  if (config?.allowUnknown) {
    return {
      valid: true,
      type: null,
      message: `Unknown class "${className}" (allowed by config)`,
    };
  }

  // Generate helpful error message
  const suggestions: string[] = [];

  // Check for common mistakes
  if (className.includes('__') && !className.includes('_')) {
    suggestions.push(
      `Use single underscore for first-level elements: "${className.replace('__', '_')}"`,
    );
  }

  if (className.startsWith('is') && !/^is[A-Z]/.test(className)) {
    suggestions.push(
      `State classes should use camelCase: "is${className.slice(2).charAt(0).toUpperCase()}${className.slice(3)}"`,
    );
  }

  if (className.startsWith('has') && !/^has[A-Z]/.test(className)) {
    suggestions.push(
      `State classes should use camelCase: "has${className.slice(3).charAt(0).toUpperCase()}${className.slice(4)}"`,
    );
  }

  if (/[A-Z]/.test(className) && !isStateClass(className)) {
    suggestions.push('HCNC classes (except states) should be lowercase');
  }

  if (className.includes('___')) {
    suggestions.push(
      'Maximum nesting is 2 levels (use __ for nested elements)',
    );
  }

  const message =
    suggestions.length > 0
      ? `Class "${className}" does not match HCNC convention. ${suggestions.join('. ')}`
      : `Class "${className}" does not match HCNC naming convention`;

  return { valid: false, type: null, message };
}

/**
 * Parse a class string into individual classes
 */
export function parseClassString(classString: string): string[] {
  return classString.split(/\s+/).filter(Boolean);
}

/**
 * Validate all classes in a class string
 */
export function validateClassString(
  classString: string,
  config?: HcncConfig,
): ValidationResult[] {
  const classes = parseClassString(classString);
  return classes.map((cls) => validateClassName(cls, config));
}

/**
 * Get all invalid classes from a class string
 */
export function getInvalidClasses(
  classString: string,
  config?: HcncConfig,
): Array<{ className: string; result: ValidationResult }> {
  const classes = parseClassString(classString);
  const invalid: Array<{ className: string; result: ValidationResult }> = [];

  for (const className of classes) {
    const result = validateClassName(className, config);
    if (!result.valid) {
      invalid.push({ className, result });
    }
  }

  return invalid;
}

// =============================================================================
// CSS Selector Validation
// =============================================================================

/**
 * Extract class selectors from a CSS selector string
 * Examples: ".card_info__title" -> ["card_info__title"]
 */
export function extractClassSelectors(selector: string): string[] {
  const matches = selector.match(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(1)); // Remove the leading dot
}

/**
 * Validate a CSS selector
 */
export function validateCssSelector(
  selector: string,
  config?: HcncConfig,
): ValidationResult[] {
  const classes = extractClassSelectors(selector);
  return classes.map((cls) => validateClassName(cls, config));
}

// =============================================================================
// SCSS Nesting Validation
// =============================================================================

/**
 * Expand SCSS nested selectors
 * Example: ".card { &_info { &__title } }" -> [".card", ".card_info", ".card_info__title"]
 */
export function expandScssNesting(scss: string): string[] {
  const expanded: string[] = [];
  const stack: string[] = [];

  // This is a simplified implementation
  // For production, consider using a proper SCSS parser
  const lines = scss.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for selector opening
    const selectorMatch = trimmed.match(
      /^([.#]?[a-zA-Z_&][a-zA-Z0-9_-]*(?:\s*,\s*[.#]?[a-zA-Z_&][a-zA-Z0-9_-]*)*)\s*\{?\s*$/,
    );
    if (selectorMatch) {
      let selector = selectorMatch[1];

      // Handle & parent selector
      if (selector.startsWith('&')) {
        const parent = stack[stack.length - 1] || '';
        selector = parent + selector.slice(1);
      }

      if (selector.startsWith('.')) {
        expanded.push(selector.slice(1));
      }

      stack.push(selector);
    }

    // Check for block close
    if (trimmed.includes('}')) {
      stack.pop();
    }
  }

  return expanded;
}

// =============================================================================
// Regex Export (for GritQL rules)
// =============================================================================

/**
 * Export regex patterns as strings for use in GritQL rules
 */
export const PATTERNS = {
  block: BLOCK_PATTERN.source,
  element: ELEMENT_PATTERN.source,
  nestedElement: NESTED_ELEMENT_PATTERN.source,
  modifier: MODIFIER_PATTERN.source,
  state: STATE_PATTERN.source,

  /** Combined pattern for any valid HCNC class */
  hcnc: `(?:${BLOCK_PATTERN.source}|${ELEMENT_PATTERN.source}|${NESTED_ELEMENT_PATTERN.source}|${MODIFIER_PATTERN.source})`,

  /** Combined pattern including states */
  hcncWithState: `(?:${BLOCK_PATTERN.source}|${ELEMENT_PATTERN.source}|${NESTED_ELEMENT_PATTERN.source}|${MODIFIER_PATTERN.source}|${STATE_PATTERN.source})`,
};
