/*
Fabricator.js
*/
"use strict";

import Uefi from "./Uefi.js";
import System from "./System.js";
import Rsync from "./Rsync.js";

let shell = require("shelljs");
let fs = require("fs");

class Fabricator extends Uefi {
  constructor(homeDir = "/home/artisan/fabricator", distroName = "Fabricator") {
    super(homeDir, distroName);

    console.log("==========================================");
    console.log("constructor");
    console.log("==========================================");
  }

  dropDir() {
    console.log("==========================================");
    console.log("dropDir");
    console.log("==========================================");
    console.log(`rm -rf ${this._homeDir}`);
    shell.rm("-rf", `rm -rf ${this._homeDir}`);
  }

  // Check or Create homeDir
  homeDir() {
    console.log("==========================================");
    console.log("homeDir");
    console.log("==========================================");

    if (!fs.existsSync(this._homeDir)) {
      console.log(`mkdir -p ${this._homeDir}`);
      shell.mkdir("-p", this._homeDir);
    }
  }

  // Check or Create homeDir
  workDirs() {
    console.log("==========================================");
    console.log("workDirs");
    console.log("==========================================");

    if (fs.existsSync(this._fsDir)) {
      // Remove and create /var ed /etc
      console.log(`rm -rf ${this._fsDir}/var`);
      shell.rm("-rf", `${this._fsDir}/var`);
      console.log(`mkdir -p ${this._fsDir}/var`);
      shell.mkdir("-p", `${this._fsDir}/var`);
      console.log(`rm -rf ${this._fsDir}/etc`);
      shell.rm("-rf", `${this._fsDir}/etc`);
      console.log(`mkdir -p ${this._fsDir}/etc/live`);
      shell.mkdir("-p", `${this._fsDir}/etc/live`);
    } else {
      // filesystem
      console.log(`mkdir -p ${this._fsDir}`);
      shell.mkdir(`-p`, this._fsDir);
      console.log(`mkdir -p ${this._fsDir}/dev`);
      shell.mkdir(`-p`, `${this._fsDir}/dev`);
      console.log(`mkdir -p ${this._fsDir}/etc`);
      shell.mkdir(`-p`, `${this._fsDir}/etc`);
      console.log(`mkdir -p ${this._fsDir}/etc/live`);
      shell.mkdir(`-p`, `${this._fsDir}/etc/live`);
      console.log(`mkdir -p ${this._fsDir}/proc`);
      shell.mkdir(`-p`, `${this._fsDir}/proc`);
      console.log(`mkdir -p ${this._fsDir}/sys`);
      shell.mkdir("-p", `${this._fsDir}/sys`);
      console.log(`mkdir -p ${this._fsDir}/media`);
      shell.mkdir(`-p`, `${this._fsDir}/media`);
      console.log(`mkdir -p ${this._fsDir}/run`);
      shell.mkdir(`-p`, `${this._fsDir}/run`);
      console.log(`mkdir -p ${this._fsDir}/var`);
      shell.mkdir(`-p`, `${this._fsDir}/var`);
      console.log(`mkdir -p ${this._fsDir}/tmp`);
      shell.mkdir(`-p`, `${this._fsDir}/tmp`);
    }
  }
}

export default Fabricator;
