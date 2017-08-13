#!/usr/bin/env node

"use strict";

import { install } from "source-map-support";
install();

import Eggs from "./lib/Eggs.js";

// INSTALLAZIONE
// conf /etc/fabricator
// iso/* usr/lib/fabricator/iso

console.log("Inizio");

const homeDir = "/srv/incubator";
const distroName = "LittleBird-BETA";

let e = new Eggs(homeDir, distroName);

//Fabricator
e.dropDir();
e.homeDir();
e.workDirs();

// System
e.systemCopy();
e.systemClean();
e.systemEdit();
e.systemIsoName();

e.fstab();
e.hostname();
e.resolvConf();
//e.resolvConfDBase();
e.interfaces();
e.hosts();
e.tempInstaller();
e.pxelinux();
e.exports();
e.dnsmasq();

// System
// f.systemCopy();
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
