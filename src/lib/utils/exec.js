let shell = require("shelljs");
let fs = require("fs");

function exec(cmd) {
  console.log(cmd);
  shell.exec(cmd);
}

module.exports = exec;
