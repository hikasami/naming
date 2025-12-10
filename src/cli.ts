#!/usr/bin/env node

/**
 * HCNC CLI - Command line tool for validating CSS class names
 *
 * Usage:
 *   npx @hikasami/naming validate "card card_info isActive"
 *   npx @hikasami/naming check ./src
 */

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { extname, join } from 'node:path';
import {
  extractClassSelectors,
  parseClassString,
  validateClassName,
  validateClassString,
} from './utils';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function colorize(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function printHelp(): void {
  console.log(`
${colorize('HCNC', 'cyan')} - Hikasami CSS Naming Convention Validator

${colorize('Usage:', 'yellow')}
  hcnc validate <classes>     Validate a class string
  hcnc check <path>           Check files in a directory
  hcnc init                   Add HCNC plugins to biome.json
  hcnc help                   Show this help message

${colorize('Examples:', 'yellow')}
  hcnc validate "card card_info isActive"
  hcnc validate "card__title"  ${colorize('# Will show error', 'dim')}
  hcnc check ./src
  hcnc init

${colorize('HCNC Naming Rules:', 'yellow')}
  Block:          ${colorize('card', 'green')}, ${colorize('button', 'green')}, ${colorize('header-nav', 'green')}
  Element L1:     ${colorize('card_info', 'green')}, ${colorize('button_icon', 'green')}
  Element L2:     ${colorize('card_info__title', 'green')}, ${colorize('card_info__description', 'green')}
  Modifier:       ${colorize('card--highlighted', 'green')}, ${colorize('button--large', 'green')}
  State:          ${colorize('isActive', 'green')}, ${colorize('hasError', 'green')}, ${colorize('isLoading', 'green')}
  Utility:        ${colorize('mt-2', 'green')}, ${colorize('flex', 'green')}, ${colorize('text-center', 'green')}
`);
}

function initCommand(): void {
  const biomeConfigPath = 'biome.json';
  const hcncPlugins = [
    './node_modules/@hikasami/naming/rules/hcnc-jsx.grit',
    './node_modules/@hikasami/naming/rules/hcnc-css.grit',
  ];

  console.log(colorize('\nInitializing HCNC for BiomeJS...', 'cyan'));

  if (existsSync(biomeConfigPath)) {
    // Update existing biome.json
    try {
      const content = readFileSync(biomeConfigPath, 'utf-8');
      const config = JSON.parse(content);

      if (!config.plugins) {
        config.plugins = [];
      }

      let added = 0;
      for (const plugin of hcncPlugins) {
        if (!config.plugins.includes(plugin)) {
          config.plugins.push(plugin);
          added++;
        }
      }

      if (added > 0) {
        writeFileSync(biomeConfigPath, `${JSON.stringify(config, null, 2)}\n`);
        console.log(
          `${colorize('✓', 'green')} Added ${added} HCNC plugin(s) to ${biomeConfigPath}`,
        );
      } else {
        console.log(
          `${colorize('✓', 'green')} HCNC plugins already configured in ${biomeConfigPath}`,
        );
      }
    } catch (err) {
      console.error(colorize(`Error updating ${biomeConfigPath}:`, 'red'), err);
      process.exit(1);
    }
  } else {
    // Create new biome.json
    const config = {
      $schema: 'https://biomejs.dev/schemas/1.9.4/schema.json',
      linter: {
        enabled: true,
        rules: {
          recommended: true,
        },
      },
      plugins: hcncPlugins,
    };

    writeFileSync(biomeConfigPath, `${JSON.stringify(config, null, 2)}\n`);
    console.log(
      `${colorize('✓', 'green')} Created ${biomeConfigPath} with HCNC plugins`,
    );
  }

  console.log(`
${colorize('Next steps:', 'yellow')}
  1. Run ${colorize('biome check ./src', 'cyan')} to lint your code
  2. HCNC will validate class names in JSX/TSX and CSS/SCSS files
`);
}

function validateCommand(classString: string): void {
  console.log(colorize('\nValidating classes:', 'cyan'), classString);
  console.log('');

  const classes = parseClassString(classString);
  let hasErrors = false;

  for (const cls of classes) {
    const result = validateClassName(cls);
    if (result.valid) {
      console.log(
        `  ${colorize('✓', 'green')} ${cls} ${colorize(`(${result.type})`, 'dim')}`,
      );
    } else {
      hasErrors = true;
      console.log(`  ${colorize('✗', 'red')} ${cls}`);
      if (result.message) {
        console.log(`    ${colorize(result.message, 'yellow')}`);
      }
    }
  }

  console.log('');

  if (hasErrors) {
    console.log(colorize('Some classes do not follow HCNC convention.', 'red'));
    process.exit(1);
  } else {
    console.log(colorize('All classes are valid!', 'green'));
  }
}

function extractClassesFromFile(content: string, ext: string): string[] {
  const classes: string[] = [];

  if (['.jsx', '.tsx', '.js', '.ts'].includes(ext)) {
    // Extract from className="..." and class="..."
    const classNameRegex = /(?:className|class)=["']([^"']+)["']/g;
    for (const match of content.matchAll(classNameRegex)) {
      classes.push(...parseClassString(match[1]));
    }

    // Extract from className={`...`} template literals (simple case)
    const templateRegex = /(?:className|class)=\{`([^`]+)`\}/g;
    for (const match of content.matchAll(templateRegex)) {
      // Remove ${...} expressions and extract remaining classes
      const cleaned = match[1].replace(/\$\{[^}]+\}/g, ' ');
      classes.push(...parseClassString(cleaned));
    }
  }

  if (['.css', '.scss', '.sass'].includes(ext)) {
    // Extract class selectors
    const selectorRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
    for (const match of content.matchAll(selectorRegex)) {
      classes.push(match[1]);
    }
  }

  if (ext === '.html') {
    // Extract from class="..."
    const classRegex = /class=["']([^"']+)["']/g;
    for (const match of content.matchAll(classRegex)) {
      classes.push(...parseClassString(match[1]));
    }
  }

  return [...new Set(classes)]; // Remove duplicates
}

function checkDirectory(dirPath: string): void {
  const supportedExtensions = [
    '.jsx',
    '.tsx',
    '.js',
    '.ts',
    '.css',
    '.scss',
    '.sass',
    '.html',
  ];
  const stats = { totalFiles: 0, totalClasses: 0 };
  const invalidClasses: Array<{
    file: string;
    className: string;
    message: string;
  }> = [];

  function walkDir(dir: string): void {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        if (!entry.startsWith('.') && entry !== 'node_modules') {
          walkDir(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = extname(entry).toLowerCase();
        if (supportedExtensions.includes(ext)) {
          stats.totalFiles++;

          try {
            const content = readFileSync(fullPath, 'utf-8');
            const classes = extractClassesFromFile(content, ext);
            stats.totalClasses += classes.length;

            for (const cls of classes) {
              const result = validateClassName(cls);
              if (!result.valid) {
                invalidClasses.push({
                  file: fullPath,
                  className: cls,
                  message: result.message || 'Invalid class name',
                });
              }
            }
          } catch (err) {
            console.error(colorize(`Error reading ${fullPath}:`, 'red'), err);
          }
        }
      }
    }
  }

  console.log(colorize('\nChecking directory:', 'cyan'), dirPath);
  console.log('');

  walkDir(dirPath);

  if (invalidClasses.length > 0) {
    console.log(
      colorize(`Found ${invalidClasses.length} invalid class(es):`, 'red'),
    );
    console.log('');

    // Group by file
    const byFile = new Map<string, typeof invalidClasses>();
    for (const entry of invalidClasses) {
      const existing = byFile.get(entry.file) || [];
      existing.push(entry);
      byFile.set(entry.file, existing);
    }

    for (const [file, entries] of byFile) {
      console.log(colorize(file, 'yellow'));
      for (const entry of entries) {
        console.log(`  ${colorize('✗', 'red')} ${entry.className}`);
        console.log(`    ${colorize(entry.message, 'dim')}`);
      }
      console.log('');
    }

    process.exit(1);
  } else {
    console.log(colorize('Summary:', 'green'));
    console.log(`  Files checked: ${stats.totalFiles}`);
    console.log(`  Classes found: ${stats.totalClasses}`);
    console.log(`  ${colorize('All classes are valid!', 'green')}`);
  }
}

// Main CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'validate':
    if (!args[1]) {
      console.error(
        colorize('Error: Please provide a class string to validate.', 'red'),
      );
      console.log('Usage: hcnc validate "card card_info isActive"');
      process.exit(1);
    }
    validateCommand(args.slice(1).join(' '));
    break;

  case 'check':
    if (!args[1]) {
      console.error(
        colorize('Error: Please provide a directory path to check.', 'red'),
      );
      console.log('Usage: hcnc check ./src');
      process.exit(1);
    }
    checkDirectory(args[1]);
    break;

  case 'init':
    initCommand();
    break;

  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;

  default:
    if (command) {
      console.error(colorize(`Unknown command: ${command}`, 'red'));
    }
    printHelp();
    process.exit(command ? 1 : 0);
}
