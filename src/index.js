#!/usr/bin/env node

"use strict";

import { install } from "source-map-support";
install();

let version = "0.2.0";
console.log(`#### incubator ${version} ####`);

import Eggs from "./lib/Eggs.js";

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
const homeDir = "/srv/incubator/" + distroName;

let e = new Eggs(homeDir, distroName);
if (rebuild) {
  e.eggsErase();
  e.systemErase();
}

//Fabricator
e.dropDir();
e.homeDir();
e.workDirs();

// System
e.systemCopy();

// Eggs client
e.fstab();
e.hostname();
e.resolvConf();
e.interfaces();
e.hosts();
e.vmlinuz();
e.initramfs();

// Eggs server
e.pxelinux();
e.dnsmasq();
e.exports();

//shell.exec("service dnsmasq stop");
//shell.exec("service dnsmasq start");
// System

//e.tempInstaller();
//e.tempInstallerMount();
//e.tempInstallerUmount();
// f.systemClean();
// f.systemEdit();
//f.systemIsoName();

// Uefi
//f.Uefi();

// f.addExtras();
// f.bootOptionsSet();
// f.bootOptionsEdit();
// f.bootOptionsMenus();
// f.isoFsMake();
// f.cleanup();
// f.finalize();

console.log(`incubator version: ${version}`);
console.log(`Remember to give the followind command, before to start:`);
console.log("sudo service dnsmasq restart");
console.log("Enjoy your birds!");
