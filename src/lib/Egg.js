/*
  Egg.js V. 0.3.0
*/

"use strict";

import rsyncAndShow from "./common.js";

let shell = require("shelljs");
let fs = require("fs");

class Egg  {
  constructor(homeDir = "/home/artisan/Incubator", distroName = "Littebird") {
    super(homeDir, distroName);

    console.log("==========================================");
    console.log("Egg constructor");
    console.log("==========================================");
  }

  erase() {
    console.log("==========================================");
    console.log("Egg erase");
    console.log("==========================================");
    console.log(`rm -rf ${this._homeDir}`);
    shell.rm("-rf", `rm -rf ${this._homeDir}`);
  }

  // Check or create a nest
  create() {
    console.log("==========================================");
    console.log("Egg create");
    console.log("==========================================");
  if (!fs.existsSync(this._homeDir)) {
      execAndShow(`mkdir -p ${this._homeDir}`)
    }

    if (fs.existsSync(this._fsDir)) {
      // Remove and create /var ed /etc
      execAndShow(`rm -rf ${this._fsDir}/var`);
      execAndShow(`mkdir -p ${this._fsDir}/var`);
      execAndShow(`rm -rf ${this._fsDir}/etc`);
      execAndShow(`mkdir -p ${this._fsDir}/etc/live`);
    } else {
      execAndShow(`mkdir -p ${this._fsDir}`);
      execAndShow(`mkdir -p ${this._fsDir}/dev`);
      execAndShow(`mkdir -p ${this._fsDir}/etc`);
      execAndShow(`mkdir -p ${this._fsDir}/etc/live`);
      execAndShow(`mkdir -p ${this._fsDir}/proc`);
      execAndShow(`mkdir -p ${this._fsDir}/sys`);
      execAndShow(`mkdir -p ${this._fsDir}/media`);
      execAndShow(`mkdir -p ${this._fsDir}/run`);
      execAndShow(`mkdir -p ${this._fsDir}/var`);
      execAndShow(`mkdir -p ${this._fsDir}/tmp`);
    }
  }

  copy(){
    systemCopy() {
      console.log("==========================================");
      console.log("egg copy");
      console.log("==========================================");
      let aCommands = [];
      aCommands.push(
        `rsync -av / ${this._fsDir} --exclude="${this
          ._homeDir}" --exclude-from="./src/lib/excludes" --delete-before --delete-excluded`
      );
      rsyncAndShow(aCommands);
      return aCommands;
    }

  }
}
export default Egg;
