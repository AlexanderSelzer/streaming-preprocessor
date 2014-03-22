module.exports.declaration = function(css, line) {
  // Variable Declarations
  var varDec = /var-([\w-]+):\s+?([\w\s\(\)#,\.]+);/;

  if (varDec.test(line)) {
    var varSearch = varDec.exec(line);
    var key = varSearch[1];
    var value = varSearch[2];
    css.variables[key] = value;
  }
  else {
    return line;
  }
};

module.exports.usage = function(css, line) {
  // Variable Usage
  var variable = /var\(([\w-]+)\)/

  if (variable.test(line)) {
    var key = variable.exec(line)[1];
    var value = css.variables[key];
    var varPos = line.search(variable);
    return line.slice(0, varPos) + value + line.slice(varPos + 5 + key.length, line.length);
  }
  else {
    return line;
  }
};