let shell = require("shelljs");
let fs = require("fs");

function bw(file, text) {
  const head = `
###############################################################
# Generated by Egg
###############################################################
`;
  const footer = `###############################################################
`;

  console.log(`### Creazione ${file}  ###`);
  text = head + text + footer;
  console.log(text);
  fs.writeFile(file, text, function(err) {
    if (err) {
      console.log(`Errore durante la scrittura di ${file}, errore: ${err}`);
    }
  });
  console.log(`### Fine creazione ${file}  ###`);
}

module.exports = bw;
