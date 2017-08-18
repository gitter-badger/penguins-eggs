// apt-get install nfs-kernel-server dnsmasq apache2 syslinux pxelinux

"use strict";

import rsyncAndShow, execAndShow, copyAndShow from "./Rsync.js";

import Egg from "./Egg.js";
let shell = require("shelljs");
let fs = require("fs");
let os = require("os");
let dns = require("dns");

class EggNetBoot extends Egg {
  constructor(
    homeDir = "/home/artisan/Incubator",
    distroName = "Littebird",
    clientUserFullName = "Artisan",
    clientUsername = "artisan",
    clientPassword = "evolution"
  ) {
    super(homeDir, distroName);

    // Variabili EggNetBoot
    this._distroName = distroName;
    this._fsDir = `${homeDir}/fs`;
    this._clientUserFullName = clientUserFullName;
    this._clientUserName = clientUsername;
    this._clientPassword = clientPassword;
    this._clientIpAddress = "127.0.1.1";

    let interfaces = Object.keys(os.networkInterfaces());
    let iface = "";
    for (let k in interfaces) {
      if (interfaces[k] != "lo") {
        iface = interfaces[k];
      }
    }
    this._netDeviceName = iface;
    this._kernelVer = os.release();

  /*
  this._netDomainName = "lan";
  this._net = "192.168.0.0";
  this._tftpRoot = "/var/www/html";
  this._netNetmask = "255.255.255.0";
  this._netGateway = "192.168.0.1";
  let dnss = dns.getServers();
  this._netDns = dnss[0];

  let ip = require("ip");
  this._netBootServer = ip.address();
  */
  }

export default Eggs;

/*
  tempInstaller() {
    let defaultGroups = "audio,cdrom,dialout,floppy,video,plugdev";

    let file = `${this._fsDir}/tempinstaller`;
    let text = `#!/bin/bash
# Questo script è stato generato da eggs
#
# Ottiene la lista degli utenti e li cancella ad esclusione di nobody.
USERS=\$(getent passwd | tr ":" " " | awk "\\\$3 >= \$(grep UID_MIN /etc/login.defs | cut -d " " -f 2) { print \\\$1 }"|sort)
for name in \$USERS; do
	if [ \$name != "nobody" ]
	then
		userdel -f -r \$name
	fi
done
#
# inserisce ${this._clientUserName} in /etc/sudoers
sed -i '/${this._clientUserName}/d' /etc/sudoers
#
groupadd -g 1000 ${this._clientUserName}
useradd -u 1000 -g 1000 -c "${this
      ._clientUserFullName},,," -G ${defaultGroups} -s /bin/bash -m ${this
      ._clientUserName}
echo -e "${this._clientPassword}\n${this._clientPassword}\n" | passwd ${this
      ._clientUserName}
#
read -p "A volte, qui occorre un controllo..."
adduser ${this._clientUserName} adm
adduser ${this._clientUserName} cdrom
adduser ${this._clientUserName} sudo
adduser ${this._clientUserName} dip
adduser ${this._clientUserName} plugdev
adduser ${this._clientUserName} lpadmin
adduser ${this._clientUserName} sambashare
#
dpkg-divert --remove --rename --quiet /usr/lib/update-notifier/apt-check
dpkg-divert --remove --rename --quiet /usr/sbin/update-initramfs
dpkg-divert --remove --rename --quiet /usr/sbin/anacron
#
shadowconfig on
rm /root/.ssh -f -r
#read -p "Adesso puoi avviare un qualsiasi pc dalla rete via pxe con questa distribuzione. Premi un tasto per continuare..."`;

    writeAndShow(file, text);
    execAndShow(`chmod 755 ${this._fsDir}/tempinstaller`);
    execAndShow(`sleep 1`);
  }

  tempInstallerMount() {
    console.log("### tempInstallerMount ###");
    let file = `${this._fsDir}/tempinstallerMount`;
    let text = `#!/bin/bash
# Questo script è stato generato da eggs
mount -o bind /proc ${this._fsDir}/proc
mount -o bind /dev ${this._fsDir}/dev
mount -o bind /sys ${this._fsDir}/sys
cd ${this._fsDir}`;

    writeAndShow(file, text);
    execAndShow(`chmod 755 ${file}`);
  }

  tempInstallerUmount() {
    console.log("### tempInstallerUmount ###");
    let file = `${this._fsDir}/tempinstallerUmount`;
    let text = `#!/bin/bash
# Questo script è stato generato da eggs
umount ${this._fsDir}/proc
sleep 1
umount ${this._fsDir}/dev
sleep 1
umount ${this._fsDir}/sys
sleep 1`;

    writeAndShow(file, text);
    execAndShow(`chmod 755 ${file}`);
  }
*/
