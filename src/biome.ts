/**
 * BiomeJS Plugin Configuration for HCNC
 *
 * This module exports the configuration needed to use HCNC rules with BiomeJS.
 *
 * @example
 * ```json
 * // biome.json
 * {
 *   "extends": ["@hikasami/naming/biome"]
 * }
 * ```
 */

import { PATTERNS } from './utils';

/**
 * BiomeJS configuration with HCNC rules
 */
export const biomeConfig = {
  $schema: 'https://biomejs.dev/schemas/1.9.4/schema.json',
  linter: {
    enabled: true,
    rules: {
      all: false,
    },
  },
  plugins: ['@hikasami/naming'],
};

/**
 * GritQL patterns for use in custom rules
 */
export const gritPatterns = {
  /**
   * Pattern to match valid HCNC class names
   */
  validHcncClass: PATTERNS.hcncWithState,

  /**
   * Pattern for block names
   */
  block: PATTERNS.block,

  /**
   * Pattern for element names (block_element)
   */
  element: PATTERNS.element,

  /**
   * Pattern for nested elements (block_element__nested)
   */
  nestedElement: PATTERNS.nestedElement,

  /**
   * Pattern for modifiers (block--modifier)
   */
  modifier: PATTERNS.modifier,

  /**
   * Pattern for state classes (isActive, hasError)
   */
  state: PATTERNS.state,
};

export default biomeConfig;
