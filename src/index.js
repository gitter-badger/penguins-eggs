#!/usr/bin/env node

"use strict";
import { install } from "source-map-support";
install();

import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";
let shell = require("shelljs");
var os = require("os");
let utils = require("./lib/utils.js");

const homeDir = "/srv/incubator/";
let distroName = "littlebird";

let program = require("commander").version("0.3.5");

program
  .command("create", "create egg and netboot if installed")
  .usage(
    "eggs create --distroname littlebird --username scott --password tiger"
  )
  .option("-d --distroname [distroname]", "The name of distro")
  .option("-u --username [username]", "The user of the distro")
  .option("-p --password [password]", "The password for user");

program.command("rebuild", "rebuild egg and netboot stuffs");

program
  .command("netboot [action]", "netboot")
  .option("purge", "purge netboot")
  .option("install", "install netboot")
  .option("purge", "purge netboot")
  .option("start", "start netboot")
  .option("stop", "stop netboot")
  .option("restart", "restart netboot");

program.parse(process.argv);

// Build or purge the Incubator
let i = new Netboot(homeDir, distroName);
let e = new Egg(homeDir, distroName);

let command = process.argv[2];
if (command == "create") {
  createAll()
} else if (program.rebuild) {
  //REBUILD
  e.erase();
  i.erase();
  createAll
} else if (command == "netboot") {
  //NETBOOT
  if (program.install) {
    i.install();
    process.exit();
  }
  if (program.purge) {
    i.purge();
    process.exit();
  }
  if (program.start) {
    start(version);
    process.exit();
  }
  if (program.stop) {
    stop(version);
    process.exit();
  }
  if (program.restart) {
    restart(version);
    process.exit();
  }
} else {
  console.log(
    "Usage: eggs [create|rebuild|netboot [start|stop|restart|install|purge]]"
  );
  process.exit(1);
}

process.exit(0);

function createAll(){
  buildEgg;
  buildNetboot;
}
function buildEgg() {
  //build egg
  e.create();
  e.copy();
  e.fstab();
  e.hostname();
  e.resolvConf();
  e.interfaces();
  e.hosts();
}

function buildNetboot() {
  // Build the Incubator
  i.create();
  i.vmlinuz();
  i.initramfs();
  i.pxelinux();
  i.dnsmasq();
  i.exports();
  restart();
}
// FINE

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
