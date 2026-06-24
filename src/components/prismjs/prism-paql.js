const paqlSharedTokens = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\/|--.*/,
    greedy: true,
  },
  string: {
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true,
  },
  number: /\d+|(0x[0-9a-f]+)/i,
  operator: /==|!=|&&|\|\|/,
  punctuation: /[[\];(){},.:]/,
};

Prism.languages.paql = {
  ...paqlSharedTokens,
  declaration: {
    // Highlight the class names of variable declarations inside of FIND
    pattern: /\bFIND\b[\s\S]*?(?=\bWHERE\b|\bAS\b|\s*$)/,
    greedy: true,
    inside: {
      ...paqlSharedTokens,
      function: /\b\w+(?=\()/,
      "class-name":
        /\b(?!FIND\b|IN\b|WHERE\b|AS\b|EXISTS\b)[A-Z][A-Za-z0-9_]*(?=\s+[a-z_]\w*)/,
      keyword: /\b(?:FIND|IN)\b/,
    },
  },
  exists_declaration: {
    // Highlight the class names of variable declarations inside of EXISTS
    pattern: /\bEXISTS\b[\s\S]*?(?=\bWHERE\b|\)|\s*$)/,
    greedy: true,
    inside: {
      ...paqlSharedTokens,
      function: /\b\w+(?=\()/,
      "class-name":
        /\b(?!FIND\b|IN\b|WHERE\b|AS\b|EXISTS\b)[A-Z][A-Za-z0-9_]*(?=\s+[a-z_]\w*)/,
      keyword: /\b(?:EXISTS|IN)\b/,
    },
  },
  aliases: {
    // Highlight the names of variables declared in AS sections.
    // Example:
    //     AS foo = bar, baz
    // foo and baz are highlighted.
    pattern: /\bAS\b[\s\S]*?(?=\s*$)/,
    greedy: true,
    inside: {
      ...paqlSharedTokens,
      "first-alias-declaration": {
        pattern: /\bAS\b\s*[a-z_]\w*\s*=\s*[^,\n]+/,
        inside: {
          keyword: /\bAS\b/,
          "alias-name": /\b[a-z_]\w*(?=\s*=)/,
        },
      },
      "assigned-alias-declaration": {
        pattern: /\n\s*[a-z_]\w*\s*=\s*[^,\n]+(?:,\s*)?/,
        inside: {
          "alias-name": {
            pattern: /(\n\s*)([a-z_]\w*)(?=\s*=)/,
            lookbehind: true,
          },
        },
      },
      "bare-alias-declaration": {
        pattern: /\n\s*[a-z_]\w*(?:,\s*)?/,
        inside: {
          "alias-name": {
            pattern: /(\n\s*)([a-z_]\w*)(?=\s*(?:,|$))/,
            lookbehind: true,
          },
        },
      },
      keyword: /\b(?:AS)\b/,
    },
  },
  function: /\b\w+(?=\()/,
  keyword: /\b(?:FIND|IN|WHERE|AS|EXISTS)\b/,
};
