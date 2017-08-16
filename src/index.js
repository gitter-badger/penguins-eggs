#!/usr/bin/env node

"use strict";

import { install } from "source-map-support";
install();

import Eggs from "./lib/Eggs.js";
let shell = require("shelljs");

var os = require("os");
console.log("hostnane: " + os.hostname());
console.log("type: " + os.type());
console.log("platform: " + os.platform());
console.log("arch: " + os.arch());
console.log("release: " + os.release());
var interfaces=Object.keys(os.getNetworkInterfaces());
var iface="";
for (var k in interfaces) {
  if (interfaces[k]!="lo"){
    iface=interfaces[k];
  }
}
console.log("inteface: " + iface);


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
