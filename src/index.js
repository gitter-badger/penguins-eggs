/* #!/usname r/bin/envnode */

"use strict";
import { install } from "source-map-support";
install();

import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";
import shell from "shelljs";
import os from "os";
import utils from "./lib/utils.js";

const homeDir = "/srv/incubator/";
let distroName = "littlebird";
let userfullname = "Artisan";
let username = "artisan";
let password = "evolution";
let version = "0.3.6";


if (!utils.isRoot()){
  console.log("Eggs need to run with supervisor privileges! You need to call it with sudo");
  console.log("Example: ");
  console.log(">>> sudo eggs netboot --install")
  console.log(">>> sudo eggs create --distroname littlebird")
  bye()
};

let program = require("commander").version(version);

program
  .command("create", "create egg and netboot if installed")
  .usage(
    "eggs create --distroname littlebird --username scott --password tiger"
  )
  .option("-d --distroname [distroname]", "The name of distro")
  .option("-U --userfullname [userfullname]","The user full name")
  .option("-u --username [username]", "The name of the user")
  .option("-p --password [password]", "The password for the user");

program
  .command("destroy", "destroy eggs and netboot stuffs")
  .usage("eggs destroy");

program
  .command("inspect", "inspect eggs and netboot stuffs")
  .usage("eggs debug");

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
let i = new Netboot(homeDir, distroName, userfullname, username, password);
let command = process.argv[2];
if (command == "inspect") {
  i.inspect();
  bye();
}
let e = new Egg(homeDir, distroName, userfullname, username, password);


if (command == "create") {
  createAll();
  bye();
} else if (command == "destroy") {
  e.erase();
  i.erase();
  bye();
} else if (command == "netboot") {
  if (program.install) {
    i.install();
    bye();
  }
  if (program.purge) {
    i.purge();
    bye();
  }
  if (program.start) {
    start(version);
    bye();
  }
  if (program.stop) {
    stop(version);
    bye();
  }
  if (program.restart) {
    restart(version);
    bye();
  }
} else {
  console.log(
    "Usage: eggs [create|rebuild|delete| netboot [start|stop|restart|install|purge]]"
  );
  bye();
}


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
