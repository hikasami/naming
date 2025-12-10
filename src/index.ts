/**
 * @hikasami/naming
 *
 * Hikasami CSS Naming Convention (HCNC) validator and BiomeJS plugin
 *
 * @example
 * ```typescript
 * import { validateClassName, validateClassString, isHcncClass } from '@hikasami/naming';
 *
 * // Validate a single class
 * const result = validateClassName('card_info__title');
 * console.log(result); // { valid: true, type: 'nested-element' }
 *
 * // Validate multiple classes
 * const results = validateClassString('card card--highlighted isActive mt-2');
 *
 * // Check if a class follows HCNC
 * if (isHcncClass('button_icon')) {
 *   console.log('Valid HCNC class!');
 * }
 * ```
 */

// Core validation functions
export {
  // Class type checks
  isBlock,
  isElement,
  isNestedElement,
  isModifier,
  isStateClass,
  isUtilityClass,
  isHcncClass,
  // Validation
  validateClassName,
  validateClassString,
  getInvalidClasses,
  getClassType,
  // Parsing
  parseClassString,
  // CSS/SCSS support
  extractClassSelectors,
  validateCssSelector,
  expandScssNesting,
  // Patterns for external use
  PATTERNS,
} from './utils';

// Types
export type {
  ValidationResult,
  HcncClassType,
  HcncConfig,
} from './utils';

// Version
export const VERSION = '1.0.0';

// Default configuration
export const defaultConfig: import('./utils').HcncConfig = {
  customUtilities: [],
  allowUnknown: false,
  strictBem: false,
};
