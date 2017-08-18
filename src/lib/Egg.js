/*
  Egg.js V. 0.3.0
*/

"use strict";
import rsyncAndShow from "./common.js";

let shell = require("shelljs");
let fs = require("fs");

class Egg  {
  constructor(
    homeDir = "/srv/incubator",
    distroName = "Littebird",
    clientUserFullName="Artisan",
    clientUserName="artisan",
    clientPassword="",

  ) {
    this.distroName = distroName;
    this.homeDir=homeDir;
    this.fsDir=homeDir+`${distroName}/fs`+;
    this.clientUserFullName = clientUserFullName;
    this.clientUserName = clientUsername;
    this.clientPassword = clientPassword;
    this.clientIpAddress = "127.0.1.1";

    let interfaces = Object.keys(os.networkInterfaces());
    let iface = "";
    for (let k in interfaces) {
      if (interfaces[k] != "lo") {
        iface = interfaces[k];
      }
    }
    this._netDeviceName = iface;
    this._kernelVer = os.release();

    console.log("==========================================");
    console.log("Egg constructor");
    console.log("==========================================");
  }

  erase() {
    console.log("==========================================");
    console.log("Egg erase");
    console.log("==========================================");
    execAndShow(`rm -rf ${this._homeDir}`);
  }

  // Check or create a nest
  create() {
    console.log("==========================================");
    console.log("Egg create");
    console.log("==========================================");
  if (!fs.existsSync(this._homeDir)) {
      execAndShow(`mkdir -p ${this._homeDir}`)
    }

    if (fs.existsSync(this._fsDir)) {
      // Remove and create /var ed /etc
      execAndShow(`rm -rf ${this._fsDir}/var`);
      execAndShow(`mkdir -p ${this._fsDir}/var`);
      execAndShow(`rm -rf ${this._fsDir}/etc`);
      execAndShow(`mkdir -p ${this._fsDir}/etc/live`);
    } else {
      execAndShow(`mkdir -p ${this._fsDir}`);
      execAndShow(`mkdir -p ${this._fsDir}/dev`);
      execAndShow(`mkdir -p ${this._fsDir}/etc`);
      execAndShow(`mkdir -p ${this._fsDir}/etc/live`);
      execAndShow(`mkdir -p ${this._fsDir}/proc`);
      execAndShow(`mkdir -p ${this._fsDir}/sys`);
      execAndShow(`mkdir -p ${this._fsDir}/media`);
      execAndShow(`mkdir -p ${this._fsDir}/run`);
      execAndShow(`mkdir -p ${this._fsDir}/var`);
      execAndShow(`mkdir -p ${this._fsDir}/tmp`);
    }
  }

  copy(){
    console.log("==========================================");
    console.log("egg copy");
    console.log("==========================================");
    let aCommands = [];
    aCommands.push(
      `rsync -av / ${this._fsDir} --exclude="${this
        ._homeDir}" --exclude-from="./src/lib/excludes" --delete-before --delete-excluded`
    );
    rsyncAndShow(aCommands);
    return aCommands;
  }

  fstab() {
    let file = `${this._fsDir}/etc/fstab`;
    let text = `
# Generated by eggs
#proc /proc proc defaults 0 0
/dev/nfs / nfs defaults 1 1
`;
    writeAndShow(file, text);
  }

  hostname() {
    let file = `${this._fsDir}/etc/hostname`;
    let text = this._distroName;
    writeAndShow(file, text);
  }

  resolvConf() {
    let file = `${this._fsDir}/etc/resolv.conf`;
    let text = `
# Generated by eggs
search ${this._netDomainName}
nameserver ${this._netDns}
`;

    writeAndShow(file, text);
  }

  interfaces() {
    let file = `${this._fsDir}/etc/network/interfaces`;
    let text = `
# Generated by eggs
auto lo
iface lo inet loopback
iface this._netDeviceName inet manual
`;

    writeAndShow(file, text);
  }

  hosts() {
    let file = `${this._fsDir}/etc/hosts`;
    let text = `
# Generated by eggs
127.0.0.1 localhost.localdomain localhost ${this._distroName}
${this._clientIpAddress} ${this._distroName}.${this._netDomainName} ${this
      ._distroName}
# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
`;

    writeAndShow(file, text);
  }

  vmlinuz() {
    execAndShow(`mkdir -p ${this._tftpRoot}/${this._distroName}`);
    console.log(`### Copia di vmlinuz-${this._kernelVer} ###`);
    execAndShow(
      `cp /boot/vmlinuz-${this._kernelVer}  ${this._tftpRoot}/${this
        ._distroName}`
    );
    execAndShow(`chmod -R 777  ${this._tftpRoot}`);
  }

  initramfs() {
    console.log(`### creazione initramfs ###`);

    let conf = `/etc/initramfs-tools/initramfs.conf`;
    let initrdFile = `/tmp/initrd.img-${this._kernelVer}`;

    let search = "MODULES=most";
    let replace = "MODULES=netboot";
    fileEdit(conf, search, replace);

    search = "BOOT=local";
    replace = "BOOT=nfs";
    fileEdit(conf, search, replace);

    execAndShow(`mkinitramfs -o /tmp/initrd.img-${this._kernelVer}`);

    console.log(`### Copia di initrd.img-${this._kernelVer} ###`);
    execAndShow(`cp ${initrdFile}  ${this._tftpRoot}/${this._distroName}`);
    console.log(`### file initramfs ###`);
  }
}
export default Egg;
