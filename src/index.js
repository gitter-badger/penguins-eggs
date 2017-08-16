#!/usr/bin/env node

"use strict";

import { install } from "source-map-support";
install();

console.log("@@@@ getOS @@@");
let getos = require("getos");
getos();
getos(function(e, os) {
  if (e) return console.log(e);
  console.log("Your OS is:" + JSON.stringify(os));
});
console.log("@@@@ getOS @@@");

var os = require("os");
console.log("hostnane: " + os.hostname());
console.log("type: " + os.type());
console.log("platform: " + os.platform());
console.log("arch: " + os.arch());
console.log("release: " + os.release());
//console.log(os.networkInterfaces());

process.exit();

import Eggs from "./lib/Eggs.js";
let shell = require("shelljs");

// INSTALLAZIONE
// conf /etc/fabricator
// iso/* usr/lib/fabricator/iso

let rebuild = false;
process.argv.forEach(function(val, index, array) {
  if (val == "rebuild") {
    rebuild = true;
    console.log("### rebuild ###");
  }
});

console.log("Inizio");

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

// Eggs
e.fstab();
e.hostname();
e.resolvConf();
e.interfaces();
e.hosts();
e.tempInstaller();
e.tempInstallerMount();
e.tempInstallerUmount();

e.pxelinux();
e.exports();
e.dnsmasq();
e.vmlinuz();
e.initramfs();

shell.exec("service dnsmasq restart");
// System

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

console.log("Fine");
