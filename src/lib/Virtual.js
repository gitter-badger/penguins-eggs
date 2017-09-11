/*
  Virtual.js V. 0.3.0
*/

"use strict";
//import os from "os";
import fs from "fs";
//import ip from "ip";
//import network from "network";
import utils from "./utils.js";

class Virtual {
  constructor(ipAddress, ipNetmask, ipGateway, ipDns, hostname, domain, netDeviceName) {
    this.ipAddress = ipAddress;
    this.ipNetmask = ipNetmask;
    this.ipGateway = ipGateway;
    this.ipDns = ipDns;
    this.hostname=hostname;
    this.domain=domain;
    this.netDeviceName=netDeviceName;
  }

  hosts() {
    let file = `/etc/hosts`;
    let text = `
127.0.0.1 localhost.localdomain localhost ${this.distroName}
${this.ipAddress} ${this.hostname}.${this.domain} ${this.hostname} pvelocalhost
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

  interfaces() {
    let file = `/etc/network/interfaces`;
    let text = `
iface ${this.netDeviceName} inet manual
auto vmbr0
iface vmbr0 inet static
  address ${this.ipAddress}
  netmask ${this.ipNetmask}
  gateway ${this.ipGateway}
  bridge_ports eth0
  bridge_stp off
  bridge_fd 0
`;
    utils.bashwrite(file, text);
  }

  install() {
    //utils.exec(`apt-get update -y`);
    //utils.exec(`apt-get upgrade -y`);
    utils.exec(`apt-get install proxmox-ve postfix open-iscsi -y`);
    utils.exec(`apt-get remove --purge os-prober -y`);
  }

  purge() {
    utils.exec(`apt-get remove --purge proxmox-ve postfix open-iscsi -y`);
  }
}

export default Virtual;
