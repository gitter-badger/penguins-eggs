let shell = require("shelljs");
let fs = require("fs");

function rsync(commands) {
  commands.forEach(function(cmd) {
    console.log(cmd);
    const { stdout, stderr, code } = shell.exec(cmd, { silent: true });
  });
}

module.exports = rsync;
