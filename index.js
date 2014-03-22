var fs = require("fs");
var chalk = require("chalk");
var _ = require("highland");
var argv = require("optimist")
.boolean("compact")
.boolean("removecomments")
.boolean("v")
.boolean("compare")
.argv;

var compactify = require("./lib/compactify");
var variable = require("./lib/variable");
var comment = require("./lib/comment");

var input = fs.readFileSync(argv._[0]).toString();

var options = {
  compact: argv.compact,
  removeComments: argv["remove-comments"],
  verbose: argv.v,
  compare: argv.compare
}

var css = {
  bytes: Buffer.byteLength(input),
  variables: {},
  comment: null
}

var lines = input.split("\n");

function clean(line) {
  if (line && !/^\s+$/.test(line))
    return true;
  else
    return false;
}

_(lines)
.map(function(line) {
  return comment.single(css, line);
})
.filter(clean)
.map(function(line) {
  if (options.removeComments)
  	return comment.multiline(css, line);
  else
    return line;
})
.map(function(line) {
  return variable.declaration(css, line);
})
.map(function(line) {
  return variable.usage(css, line);
})
.collect()
.toArray(function(array) {
  var output = array[0].filter(clean).join("\n");
  var compact = compactify(array[0].join(" "));
  
  if (options.verbose) {
  	console.log("Input size:", chalk.green(css.bytes))
    if (argv.compact)
      console.log("Output size:", chalk.magenta(Buffer.byteLength(compact)));
  	else
      console.log("Output size:", chalk.magenta(Buffer.byteLength(output)))
    console.log("\n");
  }
    
  if (options.compare) {
  	console.log(chalk.yellow("Input:"));
    console.log(chalk.green(input));
    console.log(chalk.yellow("Output:"));
    console.log(chalk.cyan(output));
  }
 	else if (argv.compact) {
    console.log(compact);
  }
  else {
    console.log(output);
  }
});
