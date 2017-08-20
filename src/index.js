#!/usr/bin/env node

"use strict";
import { install } from "source-map-support";
install();

import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";

let shell = require("shelljs");
var os = require("os");
let utils = require("./lib/utils.js");

let version = "0.3.5";
welcome();

const distroName = "littlebird";
const homeDir = "/srv/incubator/";

let options = options();

if (options["help"]) {
  help(version);
  process.exit();
}

if (options["start"]) {
  start(version);
  process.exit();
}

if (options["stop"]) {
  stop(version);
  process.exit();
}

if (options["restart"]) {
  restart(version);
  process.exit();
}



// Build or purge the Incubator
let i = new Netboot(homeDir, distroName);
if (options["install"]) {
  i.install();
  process.exit();
}
if (options["purge"]) {
  i.purge();
  process.exit();
}

// Build the Egg
let e = new Egg(homeDir, distroName);
if (options["rebuild"]) {
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

// Build the Incubator
if (options["rebuild"]) {
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

restart();

bye(version);

/*
* Options, Help and Byw
*/
function options() {
  let param = new Object();

  param["help"] = false;
  param["rebuild"] = false;
  param["install"] = false;
  param["remove"] = false;
  param["start"] = false;
  param["stop"] = false;
  param["restart"] = false;

  process.argv.forEach(function(val, index, array) {
    if (val == "rebuild") {
      param["rebuild"] = true;
    } else if (val == "help") {
      param["help"] = true;
    } else if (val == "install") {
      param["install"] = true;
    } else if (val == "purge") {
      param["purge"] = true;
    } else if (val == "start") {
      param["start"] = true;
    } else if (val == "stop") {
      param["stop"] = true;
    } else if (val == "restart") {
      param["restart"] = true;
    }
  });

  return param;
}

function help() {
  console.log(`Eggs version: ${version}`);
  console.log(
    `Description: an utility to remaster your system and boot it from remote`
  );
  console.log(`Usage: eggs [options]`);
  console.log(`>>>  help        this help`);
  console.log(`>>>  rebuild     destroy and rebuild all`);
  console.log(`>>>  install     install incubator netboot`);
  console.log(`>>>  purge       purge incubator netboot`);
  console.log(`>>>  start       start bootserver services`);
  console.log(`>>>  stop        stop bootserver services`);
  console.log(`>>>  restart     restart bootserver services`);

  console.log(`Eggs work with Debian 8 jessie and Debian 9 strecth`);
  console.log(`>>>(C) 2017 piero.proietti@gmail.com<<<`);
}

function start() {
  console.log(">>> Eggs starting netboot services ");
  utils.exec(`sudo service dnsmasq start`);
  utils.exec(`sudo service nfs-kernel-server start`);
  bye();
}

function stop() {
  console.log(">>> Eggs: stopping netboot services ");
  utils.exec(`sudo service dnsmasq stop`);
  utils.exec(`sudo service nfs-kernel-server stop`);
  bye();
}

function restart() {
  console.log(">>> Eggs restarting netboot services");
  utils.exec(`sudo service dnsmasq restart`);
  utils.exec(`sudo service nfs-kernel-server restart`);
  bye();
}

function welcome() {
  console.log(`>>> Eggs ${version} <<<`);
//  console.log(">>> hostnane: " + os.hostname());
//  console.log(">>> type: " + os.type());
//  console.log(">>> platform: " + os.platform());
//  console.log(">>> arch: " + os.arch());
//  console.log(">>> release: " + os.release());
}

function bye() {
  console.log("Enjoy your birds!");
}
