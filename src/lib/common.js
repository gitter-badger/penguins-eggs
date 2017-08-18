"use strict";
let shell = require("shelljs");

function Rsync(commands) {
  commands.forEach(function(cmd) {
    console.log("start");
    console.log(cmd);
    const { stdout, stderr, code } = shell.exec(cmd, { silent: true });
    console.log("end");
  });
}

function writeAndShow(file, text) {
console.log(`### Creazione ${file}  ###`);
console.log(text);
fs.writeFile(file, text, function(err) {
  if (err) {
    console.log(`Errore durante la scrittura di ${file}, errore: ${err}`);
  }
});
console.log(`### Fine creazione ${file}  ###`);
}

function execAndShow(cmd) {
console.log(cmd);
shell.exec(cmd);
}

function fileEdit(file, search, replace) {
fs.readFile(file, "utf8", function(err, data) {
  if (err) {
    return console.log(err);
  }

  let result = data.replace(search, replace);
  fs.writeFile(file, result, "utf8", function(err) {
    if (err) return console.log(err);
  });
});


export default Rsync, writeAndShow, execAndShow, fileEdit;
