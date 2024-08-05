const visit = require("unist-util-visit");

// Perform the LaTeX-esk transformation of:
// - 2 hyphens => 1 en-dash
// - 3 hyphens => 1 em-dash
const plugin = (options) => {
  const transformer = async (ast) => {
    visit(ast, "text", (node) => {
      // Replace em-dashes first so we don't end up with en-dash+hyphen combos.
      node.value = node.value.replaceAll("---", "\u2014"); // em-dash in unicode
      node.value = node.value.replaceAll("--", "\u2013"); // en-dash in unicode
    });
  };
  return transformer;
};

module.exports = plugin;
