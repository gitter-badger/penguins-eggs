/*
  Egg.js V. 0.3.0
*/

"use strict";

let Utils = require("./Utils.js");
let shell = require("shelljs");
let fs = require("fs");
let os = require("os");

class Egg {
  constructor(
    homeDir = "/srv/incubator",
    distroName = "Littebird",
    clientUserFullName = "Artisan",
    clientUserName = "artisan",
    clientPassword = "egg"
  ) {
    this.distroName = distroName;

    this.homeDir = homeDir;
    this.fsDir = homeDir + `${distroName}/fs`;
    this.clientUserFullName = clientUserFullName;
    this.clientUserName = clientUserName;
    this.clientPassword = clientPassword;
    this.clientIpAddress = "127.0.1.1";
    this.kernelVer = os.release();

    console.log("==========================================");
    console.log("Egg constructor");
    console.log("==========================================");
  }

  erase() {
    console.log("==========================================");
    console.log("Egg erase");
    console.log("==========================================");
    let u=Utils();
    u.exec(`rm -rf ${this.homeDir}`);
  }

  // Check or create a nest
  create() {
    console.log("==========================================");
    console.log("Egg create");
    console.log("==========================================");
    if (!fs.existsSync(this.homeDir)) {
      Utils.exec(`mkdir -p ${this.homeDir}`);
    }

    if (fs.existsSync(this.fsDir)) {
      // Remove and create /var ed /etc
      let u=Utils();
      u.exec(`rm -rf ${this.fsDir}/var`);
      Utils.exec(`mkdir -p ${this.fsDir}/var`);
      Utils.exec(`rm -rf ${this.fsDir}/etc`);
      Utils.exec(`mkdir -p ${this.fsDir}/etc/live`);
    } else {
      Utils.exec(`mkdir -p ${this.fsDir}`);
      Utils.exec(`mkdir -p ${this.fsDir}/dev`);
      Utils.exec(`mkdir -p ${this.fsDir}/etc`);
      Utils.exec(`mkdir -p ${this.fsDir}/etc/live`);
      Utils.exec(`mkdir -p ${this.fsDir}/proc`);
      Utils.exec(`mkdir -p ${this.fsDir}/sys`);
      Utils.exec(`mkdir -p ${this.fsDir}/media`);
      Utils.exec(`mkdir -p ${this.fsDir}/run`);
      Utils.exec(`mkdir -p ${this.fsDir}/var`);
      Utils.exec(`mkdir -p ${this.fsDir}/tmp`);
    }
  }

  copy() {
    console.log("==========================================");
    console.log("egg copy");
    console.log("==========================================");
    let aCommands = [];
    aCommands.push(
      `rsync -av / ${this.fsDir} --exclude="${this
        .homeDir}" --exclude-from="./src/lib/excludes" --delete-before --delete-excluded`
    );
    Utils.rsync(aCommands);
    return aCommands;
  }

  fstab() {
    let file = `${this.fsDir}/etc/fstab`;
    let text = `
#proc /proc proc defaults 0 0
/dev/nfs / nfs defaults 1 1
`;
    Utils.bashfile(file, text);
  }

  hostname() {
    let file = `${this.fsDir}/etc/hostname`;
    let text = this.distroName;
    Utils.bashfile(file, text);
  }

  resolvConf() {
    let file = `${this.fsDir}/etc/resolv.conf`;
    let text = `
search ${this.netDomainName}
nameserver ${this.netDns}
`;

    Utils.bashfile(file, text);
  }

  interfaces() {
    let file = `${this.fsDir}/etc/network/interfaces`;
    let text = `
auto lo
iface lo inet loopback
iface this._netDeviceName inet manual
`;

    Utils.bashfile(file, text);
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

    Utils.bashfile(file, text);
  }
}

export default Egg;
