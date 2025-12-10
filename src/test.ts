/**
 * HCNC Test Suite
 *
 * Run with: node --test dist/test.js
 */

import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import {
  extractClassSelectors,
  getClassType,
  isBlock,
  isElement,
  isHcncClass,
  isModifier,
  isNestedElement,
  isStateClass,
  isUtilityClass,
  parseClassString,
  validateClassName,
} from './utils';

describe('HCNC Block Validation', () => {
  test('valid blocks', () => {
    assert.ok(isBlock('card'));
    assert.ok(isBlock('button'));
    assert.ok(isBlock('header'));
    assert.ok(isBlock('header-nav'));
    assert.ok(isBlock('user-profile'));
    assert.ok(isBlock('card123'));
  });

  test('invalid blocks', () => {
    assert.ok(!isBlock('Card')); // uppercase
    assert.ok(!isBlock('card_info')); // element
    assert.ok(!isBlock('card--mod')); // modifier
    assert.ok(!isBlock('isActive')); // state
    assert.ok(!isBlock('123card')); // starts with number
    assert.ok(!isBlock('')); // empty
  });
});

describe('HCNC Element Validation', () => {
  test('valid elements (L1)', () => {
    assert.ok(isElement('card_info'));
    assert.ok(isElement('button_icon'));
    assert.ok(isElement('header_nav'));
    assert.ok(isElement('user-profile_avatar'));
  });

  test('invalid elements', () => {
    assert.ok(!isElement('card')); // block
    assert.ok(!isElement('card__title')); // wrong separator for L1
    assert.ok(!isElement('card_info__title')); // nested element
    assert.ok(!isElement('Card_info')); // uppercase
  });
});

describe('HCNC Nested Element Validation', () => {
  test('valid nested elements (L2)', () => {
    assert.ok(isNestedElement('card_info__title'));
    assert.ok(isNestedElement('card_info__description'));
    assert.ok(isNestedElement('user-profile_avatar__image'));
  });

  test('invalid nested elements', () => {
    assert.ok(!isNestedElement('card_info')); // L1 element
    assert.ok(!isNestedElement('card__title')); // missing L1
    assert.ok(!isNestedElement('card_info___title')); // triple underscore
  });
});

describe('HCNC Modifier Validation', () => {
  test('valid modifiers', () => {
    assert.ok(isModifier('card--highlighted'));
    assert.ok(isModifier('button--large'));
    assert.ok(isModifier('button--primary-action'));
    assert.ok(isModifier('card_info--active'));
    assert.ok(isModifier('card_info__title--bold'));
  });

  test('invalid modifiers', () => {
    assert.ok(!isModifier('card')); // block
    assert.ok(!isModifier('card_info')); // element
    assert.ok(!isModifier('card-highlighted')); // single dash
    assert.ok(!isModifier('card---highlighted')); // triple dash
  });
});

describe('HCNC State Validation', () => {
  test('valid states', () => {
    assert.ok(isStateClass('isActive'));
    assert.ok(isStateClass('isLoading'));
    assert.ok(isStateClass('hasError'));
    assert.ok(isStateClass('hasItems'));
    assert.ok(isStateClass('isVisible'));
  });

  test('invalid states', () => {
    assert.ok(!isStateClass('isactive')); // lowercase after is
    assert.ok(!isStateClass('haserror')); // lowercase after has
    assert.ok(!isStateClass('active')); // missing prefix
    assert.ok(!isStateClass('is')); // just prefix
    assert.ok(!isStateClass('has')); // just prefix
    assert.ok(!isStateClass('is-active')); // hyphen
    assert.ok(!isStateClass('is_active')); // underscore
  });
});

describe('HCNC Utility Validation', () => {
  test('valid utility classes', () => {
    assert.ok(isUtilityClass('flex'));
    assert.ok(isUtilityClass('mt-2'));
    assert.ok(isUtilityClass('mb-4'));
    assert.ok(isUtilityClass('text-center'));
    assert.ok(isUtilityClass('items-center'));
    assert.ok(isUtilityClass('justify-between'));
    assert.ok(isUtilityClass('text-sm'));
    assert.ok(isUtilityClass('font-bold'));
    assert.ok(isUtilityClass('hidden'));
    assert.ok(isUtilityClass('block'));
    assert.ok(isUtilityClass('grid'));
    assert.ok(isUtilityClass('gap-4'));
  });

  test('custom utility patterns', () => {
    assert.ok(isUtilityClass('custom-class', ['^custom-.*$']));
    assert.ok(isUtilityClass('my-special', ['^my-.*$']));
  });
});

describe('HCNC Combined Validation', () => {
  test('isHcncClass covers all BEM types', () => {
    assert.ok(isHcncClass('card')); // block
    assert.ok(isHcncClass('card_info')); // element
    assert.ok(isHcncClass('card_info__title')); // nested element
    assert.ok(isHcncClass('card--highlighted')); // modifier
  });

  test('isHcncClass does not include states or utilities', () => {
    assert.ok(!isHcncClass('isActive')); // state (separate category)
    assert.ok(!isHcncClass('mt-2')); // utility (separate category)
  });
});

describe('getClassType', () => {
  test('returns correct type for each category', () => {
    assert.equal(getClassType('card'), 'block');
    assert.equal(getClassType('card_info'), 'element');
    assert.equal(getClassType('card_info__title'), 'nested-element');
    assert.equal(getClassType('card--highlighted'), 'modifier');
    assert.equal(getClassType('isActive'), 'state');
    assert.equal(getClassType('mt-2'), 'utility');
  });

  test('returns null for invalid classes', () => {
    assert.equal(getClassType('InvalidClass'), null);
    assert.equal(getClassType('card___triple'), null);
  });

  test('strictBem mode excludes utilities', () => {
    assert.equal(getClassType('mt-2', { strictBem: true }), null);
    assert.equal(getClassType('flex', { strictBem: true }), null);
  });
});

describe('validateClassName', () => {
  test('valid classes return success', () => {
    const result = validateClassName('card_info__title');
    assert.ok(result.valid);
    assert.equal(result.type, 'nested-element');
  });

  test('invalid classes return error with message', () => {
    const result = validateClassName('InvalidClass');
    assert.ok(!result.valid);
    assert.ok(result.message?.includes('HCNC'));
  });

  test('allowUnknown config allows unknown classes', () => {
    const result = validateClassName('UnknownClass', { allowUnknown: true });
    assert.ok(result.valid);
    assert.equal(result.type, null);
  });
});

describe('parseClassString', () => {
  test('splits class string correctly', () => {
    const classes = parseClassString('card card_info isActive mt-2');
    assert.deepEqual(classes, ['card', 'card_info', 'isActive', 'mt-2']);
  });

  test('handles multiple spaces', () => {
    const classes = parseClassString('card    info   test');
    assert.deepEqual(classes, ['card', 'info', 'test']);
  });

  test('handles empty string', () => {
    const classes = parseClassString('');
    assert.deepEqual(classes, []);
  });

  test('handles newlines and tabs', () => {
    const classes = parseClassString('card\ninfo\ttest');
    assert.deepEqual(classes, ['card', 'info', 'test']);
  });
});

describe('extractClassSelectors', () => {
  test('extracts class selectors from CSS', () => {
    const classes = extractClassSelectors('.card .card_info .isActive');
    assert.deepEqual(classes, ['card', 'card_info', 'isActive']);
  });

  test('handles complex selectors', () => {
    const classes = extractClassSelectors('.card:hover .card_info.isActive');
    assert.deepEqual(classes, ['card', 'card_info', 'isActive']);
  });

  test('ignores non-class selectors', () => {
    const classes = extractClassSelectors('#id div .class');
    assert.deepEqual(classes, ['class']);
  });
});

describe('Real-world Examples', () => {
  test('example from HCNC documentation', () => {
    const classString = 'card card--highlighted isActive flex mt-2';
    const classes = parseClassString(classString);

    for (const cls of classes) {
      const result = validateClassName(cls);
      assert.ok(result.valid, `Class "${cls}" should be valid`);
    }
  });

  test('complex card component', () => {
    const validClasses = [
      'card',
      'card--highlighted',
      'card_info',
      'card_info__title',
      'card_info__description',
      'button',
      'button_icon',
      'isActive',
      'hasError',
      'flex',
      'items-center',
      'mt-2',
    ];

    for (const cls of validClasses) {
      const result = validateClassName(cls);
      assert.ok(
        result.valid,
        `Class "${cls}" should be valid but got: ${result.message}`,
      );
    }
  });
});

console.log('Running HCNC tests...');
