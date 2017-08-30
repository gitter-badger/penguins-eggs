"use strict";
import { install } from "source-map-support";
install();

//import { version } from "../package.json";

import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";
import Iso from "./lib/Iso.js";
import Arises from "./lib/Arises.js";

import shell from "shelljs";
import os from "os";
import utils from "./lib/utils.js";

const homeDir = "/srv/incubator/";
let distroName = "littlebird";
let userfullname = "Artisan";
let username = "artisan";
let password = "evolution";

if (!utils.isRoot()) {
  console.log(
    "teggs need to run with supervisor privileges! You need to prefix it with sudo"
  );
  console.log("Example: ");
  console.log(">>> sudo teggs install netboot");
  console.log(">>> sudo teggs create --distroname littlebird");
  console.log(">>> sudo teggs arises");
  bye();
}

let program = require("commander").version(version);

program
  .option("netboot", "define incubator netboot")
  .option("iso", "define incubator iso")
  .option("-d --distroname [distroname]", "The name of distro")
  .option("-U --userfullname [userfullname]", "The user full name")
  .option("-u --username [username]", "The name of the user")
  .option("-p --password [password]", "The password for the user")

program
  .command("create [incubator]", "create egg and netboot if installed")
  .command("destroy", "destroy teggs and netboot stuffs")
  .command("show [incubator]", "show parameters incubator")
  .command("install [incubator]", "install incubator packages")
  .command("purge [incubator]", "remove and purge incubator packages")
  .command("start", "start netboot services")
  .command("stop", "stop netboot services")
  .command("restart", "restart netboot services")
  .command("arises", "arises the penguin");

program.parse(process.argv);

// Build or purge the Incubator

if (program.distroname) {
  distroName = program.distroname;
}
if (program.userfullname) {
  username = program.userfullname;
}
if (program.username) {
  username = program.username;
}
if (program.password) {
  password = program.password;
}

let n = new Netboot(homeDir, distroName, userfullname, username, password);
let i = new Iso(homeDir, distroName, userfullname, username, password);
let e = new Egg(homeDir, distroName, userfullname, username, password);
let a = new Arises();

let command = process.argv[2];
if (command == "create") {
  if (program.netboot) {
    buildEgg();
    buildNetboot();
  } else if (program.iso) {
    buildEgg();
    buildIso();
  } else {
    console.log("usage: teggs create [netboot|iso]");
  }
} else if (command == "destroy") {
  e.erase();
  n.erase();
  i.erase();
} else if (command == "start") {
  start();
} else if (command == "stop") {
  stop();
} else if (command == "restart") {
  restart();
} else if (command == "install") {
  if (program.netboot) {
    n.install();
  } else if (program.iso) {
    i.install();
  } else {
    console.log("Usage: teggs install [netboot|iso]");
  }
} else if (command == "show") {
  if (program.netboot) {
    n.show();
  } else if (program.iso) {
    i.show();
  } else {
    console.log("Usage: teggs show [netboot|iso]");
  }
} else if (command == "purge") {
  if (program.netboot) {
    n.purge();
  } else if (program.iso) {
    i.purge();
  } else {
    console.log("Usage: teggs purge [netboot|iso]");
  }
} else if (command == "arises") {
  a.setDestinationDrive();
} else {
  console.log(
    "Usage: teggs [show|create|install|purge|start|stop|restart|arises] options [iso|netboot]"
  );
}
bye();

function createAll() {
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
  n.create();
  n.vmlinuz();
  n.initramfs();
  n.pxelinux();
  n.dnsmasq();
  n.exports();
  restart();
}

function buildIso() {
  i.create();
  i.fstab();
  i.isolinux();
  i.isolinuxCfg();
  i.alive();
  i.squashFs();
  i.makeIso();
}

// FINE
function start() {
  console.log(">>> teggs starting netboot services ");
  utils.exec(`sudo service dnsmasq start`);
  utils.exec(`sudo service nfs-kernel-server start`);
}

function stop() {
  console.log(">>> teggs: stopping netboot services ");
  utils.exec(`sudo service dnsmasq stop`);
  utils.exec(`sudo service nfs-kernel-server stop`);
}

function restart() {
  console.log(">>> teggs restarting netboot services");
  utils.exec(`sudo service dnsmasq restart`);
  utils.exec(`sudo service nfs-kernel-server restart`);
}

function bye() {
  console.log(
    `teggs version ${version} (C) 2017 Piero Proietti <piero.proietti@gmail.com>`
  );
  process.exit(0);
}
