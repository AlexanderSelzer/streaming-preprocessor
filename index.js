var fs = require("fs");
var chalk = require("chalk");
var _ = require("highland");
var argv = require("optimist")
.boolean("compact")
.boolean("v")
.argv;

var input = fs.readFileSync(argv._[0]).toString();

var options = {
  compact: argv.compact,
  verbose: argv.v
}

var css = {
  bytes: Buffer.byteLength(input),
  variables: {}
}

var lines = input.split("\n");

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
})
.map(function(line) {
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
})
.collect()
.toArray(function(array) {
  if (argv.compact) {
  
  	var output = 
    array[0]
    .join(" ")
    // Compactify separators.
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
    
    if (options.verbose) {
      console.log("Input size:", chalk.green(css.bytes))
      console.log("Output size:", chalk.magenta(Buffer.byteLength(output)))
      console.log("\n");
    }
    
    console.log(output);
  }
  else {
    console.log(array[0].join("\n"));
  }
});
