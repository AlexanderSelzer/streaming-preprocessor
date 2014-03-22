module.exports.single = function(css, line) {
  var comment = /\/\//;

  if (!comment.test(line)) {
    return line;
  }
  else {
    var commentPos = line.search(comment);
    var result = line.slice(0, commentPos);

    if (/\w/.test(result))
      return result;
  }
};

module.exports.multiline = function(css, line) {
  var start = /\/\*/;
  var end = /\*\//;
  
  // Replace full comments on the line.
  var output = line.replace(/\/\*[.\w\d\s,\.\;\(\)\{\}]*\*\//g, "");
  
  if (start.test(output)) {
    var startPosition = output.search(start);
    css.comment = true;
    
    // Give back beginning of line + comment pos.
    return output.slice(0, startPosition);
  }
  else if (end.test(output)) {
   	var endPosition = output.search(end);
    
    if (css.comment) {
      // End mark found, close comment.
      css.comment = false;
    	return output.slice(endPosition + 2, output.length);
    }
    else {
      // Lonely end comment :(
      css.comment = false;
      return output.replace(end, "");
    }
  }
  // No stop, and still in comment block.
  else if (css.comment) {
    return "";
  }
  else {
    return output;
  }
};