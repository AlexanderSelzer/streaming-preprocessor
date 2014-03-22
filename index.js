var fs = require("fs");
var chalk = require("chalk");
var _ = require("highland");
var argv = require("optimist")
.boolean("compact")
.boolean("v")
.argv;

var compactify = require("./lib/compactify");
var variable = require("./lib/variable");
var comment = require("./lib/comment");

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
  return comment.single(css, line);
})
.map(function(line) {
  return variable.declaration(css, line);
})
.map(function(line) {
  return variable.usage(css, line);
})
.collect()
.toArray(function(array) {
  if (argv.compact) {
  	var output = compactify(array[0].join(" "));
    
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
