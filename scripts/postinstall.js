#!/usr/bin/env node

/**
 * Postinstall script that shows setup instructions
 */

const message = `
╭─────────────────────────────────────────────────────────────────╮
│                                                                 │
│   @hikasami/naming installed successfully!                      │
│                                                                 │
│   Add to your biome.json:                                       │
│                                                                 │
│   {                                                             │
│     "plugins": [                                                │
│       "./node_modules/@hikasami/naming/rules/hcnc-jsx.grit",    │
│       "./node_modules/@hikasami/naming/rules/hcnc-css.grit"     │
│     ]                                                           │
│   }                                                             │
│                                                                 │
│   Or run: npx hcnc help                                         │
│                                                                 │
╰─────────────────────────────────────────────────────────────────╯
`;

console.log(message);

