/* #!/usname r/bin/envnode */

"use strict";
import { install } from "source-map-support";
install();

import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";
import Iso from "./lib/Iso.js";
import shell from "shelljs";
import os from "os";
import utils from "./lib/utils.js";

const homeDir = "/srv/incubator/";
let distroName = "littlebird";
let userfullname = "Artisan";
let username = "artisan";
let password = "evolution";
let version = "0.4.0";

if (!utils.isRoot()) {
  console.log(
    "Eggs need to run with supervisor privileges! You need to call it with sudo"
  );
  console.log("Example: ");
  console.log(">>> sudo eggs install netboot");
  console.log(">>> sudo eggs create --distroname littlebird");
  bye();
}

let program = require("commander").version(version);

program
  .command("create", "create egg and netboot if installed")
  .usage(
    "eggs create --distroname littlebird --username scott --password tiger"
  )
  .option("-d --distroname [distroname]", "The name of distro")
  .option("-U --userfullname [userfullname]", "The user full name")
  .option("-u --username [username]", "The name of the user")
  .option("-p --password [password]", "The password for the user");

program
  .command("destroy", "destroy eggs and netboot stuffs")
  .usage("eggs destroy");

program
  .command("show [incubator]", "show parameters incubator")
  .option("netboot", "show parameters incubator netboot")
  .option("iso", "show parameters incubator iso");

program
  .command("install [incubator]", "install incubator")
  .option("netboot", "install netboot")
  .option("iso", "install incubator iso");

program
  .command("purge [incubator]", "install incubator")
  .option("netboot", "remove and purge incubator netboot")
  .option("iso", "remove and purge incubator iso");

program
  .command("start", "start netboot services")
  .command("stop", "stop netboot services")
  .command("restart", "restart netboot services");

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

let command = process.argv[2];
if (command == "create") {
  createAll();
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
    console.log("Usage: eggs install [netboot|iso]");
  }
} else if (command == "show") {
  if (program.netboot) {
    n.show();
  } else if (program.iso) {
    i.show();
  } else {
    console.log("Usage: eggs show [netboot|iso]");
  }
} else if (command == "purge") {
  if (program.netboot) {
    n.purge();
  } else if (program.iso) {
    i.purge();
  } else {
    console.log("Usage: eggs purge [netboot|iso]");
  }
} else {
  console.log(
    "Usage: eggs [create|rebuild|install[netboot|iso]|purge[netboot|iso]|start|stop|restart]"
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
// FINE
function start() {
  console.log(">>> Eggs starting netboot services ");
  utils.exec(`sudo service dnsmasq start`);
  utils.exec(`sudo service nfs-kernel-server start`);
}

function stop() {
  console.log(">>> Eggs: stopping netboot services ");
  utils.exec(`sudo service dnsmasq stop`);
  utils.exec(`sudo service nfs-kernel-server stop`);
}

function restart() {
  console.log(">>> Eggs restarting netboot services");
  utils.exec(`sudo service dnsmasq restart`);
  utils.exec(`sudo service nfs-kernel-server restart`);
}

function bye() {
  console.log("Eggs (C) 2017 Piero Proietti <piero.proietti@gmail.com>");
  process.exit(0);
}
