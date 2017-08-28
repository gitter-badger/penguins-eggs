/*
  Iso.js V. 0.3.0
*/

"use strict";
import os from "os";
import fs from "fs";
import ip from "ip";
import network from "network";
import utils from "./utils.js";

class Iso {
  constructor(
    homeDir = "/srv/incubator",
    distroName,
    clientUserFullName,
    clientUserName,
    clientPassword
  ) {
    this.fsDir = homeDir + `${distroName}/fs`;
    this.isoDir = homeDir + `${distroName}/iso`;
    this.distroName = distroName;

    this.clientUserFullName = clientUserFullName;
    this.clientUserName = clientUserName;
    this.clientPassword = clientPassword;
    this.clientIpAddress = "127.0.1.1";

    this.kernelVer = utils.kernerlVersion();
    this.netDomainName = utils.netDomainName();
  }

  show() {
    console.log("Eggs: incubator iso parameters ");
    console.log(">>> kernelVer: " + this.kernelVer);
    console.log(">>> netDomainName: " + this.netDomainName);
  }

  create() {
    console.log("==========================================");
    console.log("Incubator iso: create");
    console.log("==========================================");
    if (!fs.existsSync(this.isoDir)) {
      utils.exec(`mkdir -p ${this.isoDir}`);
    }
  }

  erase() {
    console.log("==========================================");
    console.log("Incubator iso: erase");
    console.log("==========================================");
    utils.exec(`rm -rf ${this.isoDir}`);
  }

  vmlinuz() {
    utils.exec(`mkdir -p ${this.tftpRoot}/${this.distroName}`);
    console.log(`### Copia di vmlinuz-${this.kernelVer} ###`);
    utils.exec(`cp /boot/vmlinuz-${this.kernelVer}  ${this.isoDir}`);
    utils.exec(`chmod -R 777  ${this.isoDir}`);
  }

  initramfs() {
    console.log(`### creazione initramfs ###`);

    let conf = `/etc/initramfs-tools/initramfs.conf`;
    let initrdFile = `/tmp/initrd.img-${this.kernelVer}`;

    let search = "MODULES=netboot";
    let replace = "MODULES=most";
    utils.sr(conf, search, replace);

    search = "BOOT=nfs";
    replace = "BOOT=local";
    utils.sr(conf, search, replace);

    utils.exec(`mkinitramfs -o /tmp/initrd.img-${this.kernelVer}`);

    console.log(`### Copia di initrd.img-${this.kernelVer} ###`);
    utils.exec(`cp ${initrdFile}  ${this.isoDir}`);
    console.log(`### file initramfs ###`);
  }

  install() {
    utils.exec(`apt-get update`);
    utils.exec(
      `apt-get install squashfs-tools xorriso live-boot live-boot-initramfs-tools live-config live-config-systemd syslinux syslinux-common isolinux -y`
    );
  }

  purge() {
    utils.exec(
      `apt-get remove --purge squashfs-tools xorriso live-boot live-boot-initramfs-tools live-config live-config-systemd syslinux syslinux-common isolinux -y`
    );
  }
}
export default Iso;
