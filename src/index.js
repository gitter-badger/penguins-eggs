#!/usr/bin/env node

"use strict";
import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";

let shell = require("shelljs");
var os = require("os");
let utils =require("./lib/utils.js");

import { install } from "source-map-support";
install();

let version = "0.3.1";
console.log(`#### incubator ${version} ####`);


const distroName = "littlebird";
const homeDir = "/srv/incubator/";

let options =parameters()
let i = new Netboot(homeDir, distroName);

// Build or purge the Incubator
if (options["install"]){
    i.install();
    process.exit();
}
if (options["purge"]){
    i.purge();
    process.exit();
}


// Build the Egg
let e = new Egg(homeDir, distroName);
if (options['rebuild']) {
  e.erase();
  e.create();
} else {
  e.create();
}

e.copy();
e.fstab();
e.hostname();
e.resolvConf();
e.interfaces();
e.hosts();


if (options['rebuild']) {
  i.erase();
  i.create();
} else {
  i.create();
}
i.vmlinuz();
i.initramfs();
i.pxelinux();
i.dnsmasq();
i.exports();

console.log(`incubator version: ${version}`);
console.log(`Remember to give the followind command, before to start:`);
console.log("sudo service dnsmasq reload");
console.log("service nfs-kernel-server reload");


console.log("Enjoy your birds!");

function parameters(){
  let param= new Object();
  param['help']=false;
  param['rebuild']=false;
  param['install']=false;
  param['remove']=false;

  process.argv.forEach(function(val, index, array) {
    if (val == "rebuild") {
      param['rebuild']=true;
    } else if (val == "r") {
      param['rebuild']=true;
    } else if (val == "help") {
      param['help']=true;
    } else if (val == "h") {
      param['help']=true;
    } else if (val == "install") {
      param['install']=true;
    } else if (val == "i") {
      param['install']=true;
    }else if (val == "purge") {
      param['purge']=true;
    } else if (val == "r") {
      param['purge']=true;
    }
  });

  if (param['help']) {
    console.log(`incubator version: ${version}`);
    console.log(
      `Description: an utility to remaster your system and boot it from remote`
    );
    console.log(`Usage: incubator [options]`);
    console.log(`h,   help        this help`);
    console.log(`r,   rebuild     destroy and rebuild all`);
    console.log(`i,   install     install incubator netboot`);
    console.log(`p,   purge       purge incubator netboot`);

    console.log(`Incubator work, at moment, with Debian 8 and Debian 9`);
    console.log(`(C) 2017 piero.proietti@gmail.com`);
    process.exit();
  }

  console.log("hostnane: " + os.hostname());
  console.log("type: " + os.type());
  console.log("platform: " + os.platform());
  console.log("arch: " + os.arch());
  console.log("release: " + os.release());

  return param;
}
