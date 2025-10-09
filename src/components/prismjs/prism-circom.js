Prism.languages.circom = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
    greedy: true,
  },
  string: {
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true,
  },
  function: /\b\w+(?=\()/,
  keyword:
    /\b(?:input|output|signal|component|template|function|pragma|public)\b/,
  // support for time ticks, vectors, and real numbers
  number:
    /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  operator: /<--?|<==?|-->|==>|===|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
  punctuation: /[[\];(),.:]/,
};
