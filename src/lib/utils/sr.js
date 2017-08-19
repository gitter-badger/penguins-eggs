let shell = require("shelljs");
let fs = require("fs");

function sr(file, search, replace) {
  fs.readFile(file, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data.replace(search, replace);
    fs.writeFile(file, result, "utf8", function(err) {
      if (err) return console.log(err);
    });
  });
}

module.exports = sr;
