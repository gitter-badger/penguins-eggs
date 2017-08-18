#!/usr/bin/env node

"use strict";

import { install } from "source-map-support";
install();

let version = "0.3.0";
console.log(`#### incubator ${version} ####`);

import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";

// Check for parameters
let rebuild = false;
let help = false;
process.argv.forEach(function(val, index, array) {
  if (val == "rebuild") {
    rebuild = true;
  } else if (val == "r") {
    rebuild = true;
  } else if (val == "help") {
    help = true;
  } else if (val == "h") {
    help = true;
  }
});

if (help) {
  console.log(`incubator version: ${version}`);
  console.log(
    `Description: an utility to remaster your system and boot it from remote`
  );
  console.log(`Usage: incubator [options]`);
  console.log(`h,   help        this help`);
  console.log(`r,   rebuild     destroy and rebuild all`);
  console.log(`Incubator work, at moment, with Debian 8 and Debian 9`);
  console.log(`(C) 2017 piero.proietti@gmail.com`);
  process.exit();
}

let shell = require("shelljs");
var os = require("os");
console.log("hostnane: " + os.hostname());
console.log("type: " + os.type());
console.log("platform: " + os.platform());
console.log("arch: " + os.arch());
console.log("release: " + os.release());


const distroName = "littlebird";
const homeDir = "/srv/incubator/";

// Build the Egg
let e = new Egg(homeDir, distroName);
if (rebuild) {
  e.erase();
  e.create();
} else {
  e.create();
}
//e.copy();
e.fstab();
e.hostname();
e.resolvConf();
e.interfaces();
e.hosts();

process.exit();
// Build the Incubator
let i = new Netboot();
if (rebuild) {
  i.erase();
  i.create();
} else {
  i.create();
}
i.vmlinuz();
i.initramfs();
i.pxelinux();
i.dnsmasq();

console.log(`incubator version: ${version}`);
console.log(`Remember to give the followind command, before to start:`);
console.log("sudo service dnsmasq restart");
console.log("Enjoy your birds!");
