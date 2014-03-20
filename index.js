var fs = require("fs");
var _ = require("highland");

var css = {
  variables: {}
}

var cssFile = fs.readFileSync(process.argv[2]);

var lines = cssFile.toString().split("\n");

_(lines)
.map(function(line) {
  var comment = /\/\//;

  if (!comment.test(line)) {
    return line;
  }
  else {
    var commentPos = line.search(comment);
    var result = line.slice(0, commentPos);

    if (/\w/.test(result))
      return result;
    else
      return null;
  }
})
.filter(function(line) {
  if (line !== null)
    return true;
})
.map(function(line) {
  var varDec = /var-([\w-]+):\s+?(.+);/;

  if (varDec.test(line)) {
    var varSearch = varDec.exec(line);
    var key = varSearch[1];
    var value = varSearch[2];
    css.variables[key] = value;
    console.log(key, value);
  }
  return line;
})
.map(function(line) {
  var variable = /var\(([\w-]+)\)/

  if (variable.test(line)) {
    var key = variable.exec(line)[1];
    var value = css.variables[key];
    console.log("Found var:", key, css.variables[key]);
    var varPos = line.search(variable);
    return line.slice(0, varPos) + value + line.slice(varPos + 5 + key.length, line.length);
  }
  else {
    return line;
  }
})
.collect()
.toArray(function(array) {
  console.log(array[0].join("\n"));
});
