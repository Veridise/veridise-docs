Prism.languages.paql = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\/|--.*/,
    greedy: true,
  },
  string: {
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true,
  },
  function: /\b\w+(?=\()/,
  keyword: /\b(?:FIND|IN|WHERE|AS|EXISTS)\b/,
  number: /\d+|(0x[0-9a-f]+)/i,
  operator: /==|!=|&&|\|\|/,
  punctuation: /[[\];(){},.:]/,
};
