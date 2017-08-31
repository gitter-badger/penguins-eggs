/*
  Egg.js V. 0.3.0
*/

"use strict";

import shell from "shelljs";
import fs from "fs";
import os from "os";
import dns from "dns";
import utils from "./utils.js";

class Egg {
  constructor(
    homeDir = "/srv/incubator",
    distroName,
    clientUserFullName,
    clientUserName,
    clientPassword
  ) {
    this.distroName = distroName;
    this.homeDir = homeDir;
    this.fsDir = homeDir + `${distroName}/fs`;
    this.clientUserFullName = clientUserFullName;
    this.clientUserName = clientUserName;
    this.clientPassword = clientPassword;
    this.clientIpAddress = "127.0.1.1";

    this.kernelVer = utils.kernerlVersion();
    this.netDeviceName = utils.netDeviceName();
    this.netDomainName = "lan";
    this.netDns = utils.netDns();
  }

  erase() {
    console.log("==========================================");
    console.log("eggs erase");
    console.log("==========================================");
    utils.exec(`rm -rf ${this.homeDir}`);
  }

  // Check or create a nest
  create() {
    console.log("==========================================");
    console.log("eggs create");
    console.log("==========================================");
    if (!fs.existsSync(this.homeDir)) {
      utils.exec(`mkdir -p ${this.homeDir}`);
    }

    if (fs.existsSync(this.fsDir)) {
      // Remove and create /var ed /etc

      utils.exec(`rm -rf ${this.fsDir}/var`);
      utils.exec(`mkdir -p ${this.fsDir}/var`);
      utils.exec(`rm -rf ${this.fsDir}/etc`);
      utils.exec(`mkdir -p ${this.fsDir}/etc/live`);
    } else {
      utils.exec(`mkdir -p ${this.fsDir}`);
      utils.exec(`mkdir -p ${this.fsDir}/dev`);
      utils.exec(`mkdir -p ${this.fsDir}/etc`);
      utils.exec(`mkdir -p ${this.fsDir}/etc/intefaces`);
      utils.exec(`mkdir -p ${this.fsDir}/etc/live`);
      utils.exec(`mkdir -p ${this.fsDir}/proc`);
      utils.exec(`mkdir -p ${this.fsDir}/sys`);
      utils.exec(`mkdir -p ${this.fsDir}/media`);
      utils.exec(`mkdir -p ${this.fsDir}/run`);
      utils.exec(`mkdir -p ${this.fsDir}/var`);
      utils.exec(`mkdir -p ${this.fsDir}/tmp`);
    }
  }

  copy() {
    console.log("==========================================");
    console.log("Egg copy");
    console.log("==========================================");
    let aCommands = [];
    aCommands.push(
      `rsync -aq / ${this.fsDir} --exclude="${this
        .homeDir}" --exclude-from="./excludes" --delete-before --delete-excluded`
    );
    utils.rsync(aCommands);
    return aCommands;
  }

  fstab() {
    let file = `${this.fsDir}/etc/fstab`;
    let text = `
#proc /proc proc defaults 0 0
/dev/nfs / nfs defaults 1 1
`;
    utils.bashwrite(file, text);
  }

  hostname() {
    let file = `${this.fsDir}/etc/hostname`;
    let text = this.distroName;
    utils.bashwrite(file, text);
  }

  resolvConf() {
    let file = `${this.fsDir}/etc/resolv.conf`;
    let text = `
search ${this.netDomainName}
nameserver ${this.netDns}
nameserver 8.8.8.8
nameserver 8.8.4.4
`;

    utils.bashwrite(file, text);
  }

  interfaces() {
    let file = `${this.fsDir}/etc/network/interfaces`;
    let text = `
auto lo
iface lo inet loopback
iface this.netDeviceName inet manual
`;

    utils.bashwrite(file, text);
  }

  hosts() {
    let file = `${this.fsDir}/etc/hosts`;
    let text = `
127.0.0.1 localhost.localdomain localhost ${this.distroName}
${this.clientIpAddress} ${this.distroName}.${this.netDomainName} ${this
      .distroName}
# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
`;

    utils.bashwrite(file, text);
  }
}

export default Egg;
