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