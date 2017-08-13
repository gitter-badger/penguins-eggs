//"use strict";
//let exec = require("child_process").spawnSync;
let shell = require("shelljs");

function Rsync(commands) {
  commands.forEach(function(cmd) {
    console.log("start");
    console.log(cmd);
    const { stdout, stderr, code } = shell.exec(cmd, { silent: true });
    console.log("end");
  });
}

export default Rsync;
