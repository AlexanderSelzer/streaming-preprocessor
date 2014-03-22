module.exports = function(line) {
    return line
     // Compactt separators.
    .replace(/;\s+/g, ";")
    .replace(/:\s+/g, ":")
    .replace(/,\s+/g, ",")
    // Remove spaces before/after braces.
    .replace(/\{\s+/g, "{")
    .replace(/\s+\}/g, "}")
    .replace(/\s+\{/g, "{")
    .replace(/\}\s+/g, "}")
    // Remove redundant spaces.
    .replace(/\s+/g, " ")
    // Remove empty selectors.
    .replace(/[-:\w]+\{\}/g, "");
};