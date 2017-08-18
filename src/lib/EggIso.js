/*
Iso.js
  isoLinuxCopy,
  kernelCopy,
*/
"use strict";

import Uefi from "./Uefi.js";
import Rsync from "./Rsync.js";

let shell = require("shelljs");
let fs = require("fs");

class EggIso extends Uefi {
  constructor(homeDir = "/home/artisan/fabricator", distroName = "Fabricator") {
    super(homeDir, distroName);

    this._isoDir = homeDir + "/iso";

    console.log("==========================================");
    console.log("constructor");
    console.log("==========================================");
  }

  dropIso() {
    console.log("==========================================");
    console.log("dropIso");
    console.log("==========================================");
    console.log(`rm -rf ${this._isoDir}`);
    shell.rm("-rf", `rm -rf ${this._isoDir}`);
  }

  // Check or Create homeDir
  isoDir() {
    console.log("==========================================");
    console.log("isoDirs");
    console.log("==========================================");

    if (fs.existsSync(this._isoDir)) {
      console.log(`rm -rf ${this._isoDir}`);
      shell.rm("-rf", this._isoDir);
      console.log(`mkdir -p ${this._isoDir}`);
      shell.mkdir("-p", this._isoDir);
      console.log(`mkdir -p ${this._isoDir}/live`);
      shell.mkdir("-p", `${this._isoDir}/live`);
      console.log(`mkdir -p ${this._isoDir}/preseed`);
      shell.mkdir("-p", `${this._isoDir}/preseed`);
    }
  }

  isolinux() {
    console.log("==========================================");
    console.log("isoLinuxCopy");
    console.log("==========================================");

    let isoLinuxBin = "";
    let vesamenuFil = "";
    let vesamenuDir = "";
    let foundIsoLinux = false;
    let foundVesa32 = false;
    let aCommands = [];

    if (fs.existsSync("/usr/lib/ISOLINUX/isolinux.bin")) {
      isoLinuxBin = "/usr/lib/ISOLINUX/isolinux.bin";
      foundIsoLinux = true;
    } else if (fs.existsSync("/usr/lib/syslinux/isolinux.bin")) {
      isoLinuxBin = "/usr/lib/syslinux/isolinux.bin";
      foundIsoLinux = true;
    }

    if (foundIsoLinux) {
      console.log(`We found: ${isoLinuxBin}`);
    } else {
      console.log(`You need to install isolinux package`);
    }

    if (fs.existsSync("/usr/lib/syslinux/modules/bios/vesamenu.c32")) {
      vesamenuFil = "/usr/lib/syslinux/modules/bios/vesamenu.c32";
      vesamenuDir = "/usr/lib/syslinux/modules/bios";
      foundVesa32 = true;
      aCommands.push(`rsync -a ${vesamenuDir}/chain.c32 ${this._isoDir}`);
      aCommands.push(`rsync -a ${vesamenuDir}/ldlinux.c32 ${this._isoDir}`);
      aCommands.push(`rsync -a ${vesamenuDir}/libcom32.c32 ${this._isoDir}`);
      aCommands.push(`rsync -a ${vesamenuDir}/libutil.c32 ${this._isoDir}`);
    } else {
      vesamenuFil = "/usr/lib/syslinux/vesamenu.c32";
    }

    aCommands.push(`rsync -a ${isoLinuxBin} ${this._isoDir}`);
    aCommands.push(`rsync -a ${vesamenuFil} ${this._isoDir}`);

    if (fs.existsSync("/usr/lib/incubator/menu_help")) {
      aCommands.push(
        `cp -a /usr/lib/incubator/menu_help ${this._isoDir}`
      );
    }

    Rsync(aCommands);
    return aCommands;
  }

  vmlinuz(){
    const kernelImage = `/vmlinuz`;
    shell.cp(kernelImage,this._isoDir );
  }

  initramfs(){
    const initrdImage = "/initrd.img";
    shell.cp(initrdImage,this._isoDir );
  }
}

export default Iso;
