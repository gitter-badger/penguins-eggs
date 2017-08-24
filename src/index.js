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
let userfullname="Artisan";
let username="artisan";
let password="evolution";
let version ="0.3.5";

let program = require("commander").version(version);

program
.command("create", "create egg and netboot if installed")
.usage("eggs create --distroname littlebird --username scott --password tiger")
.option("-d --distroname [distroname]", "The name of distro")
.option("-u --username [username]", "The user of the distro")
.option("-p --password [password]", "The password for user");

program
.command("rebuild", "rebuild egg and netboot stuffs")
.usage("eggs rebuild --distroname littlebird --username scott --password tiger")
.option("-d --distroname [distroname]", "The name of distro")
.option("-u --username [username]", "The user of the distro")
.option("-p --password [password]", "The password for user");

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
distroName=program.distroname;
username=program.username;
password=program.password;

let i = new Netboot(homeDir, distroName, userfullname, usename, password);
let e = new Egg(homeDir, distroName);

let command = process.argv[2];
if (command == "create") {
  createAll()
} else if (program.rebuild) {
  //REBUILD
  console.log("Rebuilding...");
  e.erase();
  i.erase();
  createAll();
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
    "Usage: eggs [create|rebuild|delete| netboot [start|stop|restart|install|purge]]"
  );
  process.exit(1);
}

process.exit(0);

function createAll(){
  buildEgg();
  buildNetboot();
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

function bye() {
  console.log("Enjoy your birds!");
}
