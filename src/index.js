#!/usr/bin/env node

"use strict";

import { install } from "source-map-support";
install();

import Eggs from "./lib/Eggs.js";

// INSTALLAZIONE
// conf /etc/fabricator
// iso/* usr/lib/fabricator/iso

console.log("Inizio");

const distroName = "littlebird";
const homeDir = "/srv/incubator/" + distroName;

let e = new Eggs(homeDir, distroName);

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
e.pxelinux();
e.exports();
e.dnsmasq();
e.vmlinuz();
e.initramfs();

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
