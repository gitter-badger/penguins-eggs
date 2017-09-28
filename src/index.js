"use strict";
import { install } from "source-map-support";
install();
import { version, name, author, mail, homepage } from "../package.json";
import { hatch } from "./lib/hatch.js";
import Egg from "./lib/Egg.js";
import Netboot from "./lib/Netboot.js";
import Iso from "./lib/Iso.js";
import utils from "./lib/utils.js";
let program = require("commander").version(version);

const homeDir = "/var/lib/vz/penguins-eggs/";
let distroName = "eggs";
let userfullname = "artisan";
let username = "artisan";
let password = "evolution";

if (utils.isRoot()) {
  program
    .option("netboot", "define incubator netboot")
    .option("iso", "define incubator iso")
    .option("ve", "virtual environment")
    .option("users", "userlist")
    .option("-d, --distroname <distroname>", "The name of the distribution")
    .option("-U, --userfullname <userfullname>", "The user full name")
    .option("-u, --username <username>", "The name of the user")
    .option("-p, --password <password>", "The password for the user");

  program
    .command("create [incubator]", "create egg and netboot if installed")
    .command("destroy", "destroy eggs and netboot stuffs")
    .command("show [incubator]", "show parameters incubator")
    .command("install [incubator]", "install incubator packages")
    .command("purge [incubator]", "remove and purge incubator packages")
    .command("start", "start netboot services")
    .command("stop", "stop netboot services")
    .command("restart", "restart netboot services")
    .command("test", "test")
    .command("hatch", "hatching the penguin's egg");

  program.parse(process.argv);

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

  let e = new Egg(homeDir, distroName, userfullname, username, password);
  let n = new Netboot(homeDir, distroName, userfullname, username, password);
  let i = new Iso(homeDir, distroName, userfullname, username, password);

  let command = process.argv[2];

  if (command == "create") {
    if (program.netboot) {
      buildEgg(e);
      buildNetboot(n);
    } else if (program.iso) {
      i.install();
      buildEgg(e);
      buildIso(i);
      i.purge();
    } else {
      console.log("usage: eggs create [netboot|iso]");
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
    } else {
      console.log("Usage: eggs install [netboot]");
    }
  } else if (command == "show") {
    if (program.netboot) {
      n.show();
    } else if (program.iso) {
      i.show();
    } else {
      console.log("Usage: eggs show [netboot|iso|users]");
    }
  } else if (command == "purge") {
    if (program.netboot) {
      n.purge();
    } else {
      console.log("Usage: eggs purge [netboot]");
    }
  } else if (command == "hatch") {
    startHatching();
  } else {
    console.log(
      "Usage: eggs [show|create|install|purge|start|stop|restart|hatch] options [iso|netboot]"
    );
  }
} else {
  console.log(
    `${name} need to run with supervisor privileges! You need to prefix it with sudo`
  );
  console.log("Example: ");
  console.log(">>> sudo eggs install netboot");
  console.log(">>> sudo eggs create --distroname littlebird");
  console.log(">>> sudo eggs hatch");
}
bye();
// END MAIN

function buildEgg(e) {
  e.create();
  e.copy();
  e.fstab();
  e.hostname();
  e.resolvConf();
  e.interfaces();
  e.hosts();
}

function buildNetboot(n) {
  n.create();
  n.vmlinuz();
  n.initramfs();
  n.pxelinux();
  n.dnsmasq();
  n.exports();
  restart();
}

function buildIso(i) {
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
  console.log(`>>> ${name}: starting netboot services`);
  utils.exec(`sudo service dnsmasq start`);
  utils.exec(`sudo service nfs-kernel-server start`);
}

function stop() {
  console.log(`>>> ${name}: stopping netboot services`);
  utils.exec(`sudo service dnsmasq stop`);
  utils.exec(`sudo service nfs-kernel-server stop`);
}

function restart() {
  console.log(`>>> ${name}: restarting netboot services`);
  utils.exec(`sudo service dnsmasq restart`);
  utils.exec(`sudo service nfs-kernel-server restart`);
}

function bye() {
  console.log(
    `${name} version ${version} (C) 2017 ${author} <${mail}> site ${homepage}`
  );
  process.exit(0);
}

function startHatching() {
  console.log("The penguin start to hatch...");
  hatch();
}
