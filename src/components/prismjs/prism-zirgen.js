// Docs:
// - https://prismjs.com/extending
// - https://prismjs.com/tokens
Prism.languages.zirgen = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
    greedy: true,
  },
  string: {
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true,
  },
  builtin: /\b(Assert|NondetReg|Reg|Val|Add|Mul|InRange|Isz)\b/,
  function: /\b\w+((?=\()|(?=<))/,
  keyword:
    /\b(?:component|function|for|global|extern|test|public|reduce|init|with)\b/,

  number:
    /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  operator: /([-+&|:])\1|[?:~]|[@\-+*\/%&|^!=<>]=?/,
  punctuation: /[[\];(),.:\{\}]/,
};
