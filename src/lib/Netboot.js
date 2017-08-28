/*
  Netboot.js V. 0.3.0
*/

"use strict";
import os from "os";
import fs from "fs";
import ip from "ip";
import network from "network";
import utils from "./utils.js";

class Netboot {
  constructor(
    homeDir = "/srv/incubator",
    distroName,
    clientUserFullName,
    clientUserName,
    clientPassword
  ) {
    this.fsDir = homeDir + `${distroName}/fs`;
    this.distroName = distroName;

    this.clientUserFullName = clientUserFullName;
    this.clientUserName = clientUserName;
    this.clientPassword = clientPassword;
    this.clientIpAddress = "127.0.1.1";

    this.kernelVer = utils.kernerlVersion();

    this.netDeviceName = utils.netDeviceName();
    this.netBootServer = utils.netBootServer();
    this.netDeviceName = utils.netDeviceName();
    this.netDns = utils.netDns();
    this.netGateway = utils.netGateway();
    this.netDomainName = utils.netDomainName();
    this.netNetmask = utils.netNetmask();
    this.net = utils.net(this.netBootServer, this.netNetmask);

    this.tftpRoot = "/var/www/html";
  }

  show() {
    console.log("Eggs ha rilevato questi parametri:");
    console.log(">>> kernelVer: " + this.kernelVer);
    console.log(">>> netBootServer: " + this.netBootServer);
    console.log(">>> netDeviceName: " + this.netDeviceName);
    console.log(">>> netDns: " + this.netDns);
    console.log(">>> netGateway: " + this.netGateway);
    console.log(">>> netDomainName: " + this.netDomainName);
    console.log(">>> netNetmask: " + this.netNetmask);
    console.log(">>> net: " + utils.net(this.netBootServer, this.netNetmask));
  }

  create() {
    console.log("==========================================");
    console.log("Incubator netboot: create");
    console.log("==========================================");
    if (!fs.existsSync(this.tftpRoot)) {
      utils.exec(`mkdir -p ${this.tftpRoot}`);
    }
  }

  erase() {
    console.log("==========================================");
    console.log("Incubator netboot: erase");
    console.log("==========================================");
    utils.exec(`rm -rf ${this.tftpRoot}`);
  }

  vmlinuz() {
    utils.exec(`mkdir -p ${this.tftpRoot}/${this.distroName}`);
    console.log(`### Copia di vmlinuz-${this.kernelVer} ###`);
    utils.exec(
      `cp /boot/vmlinuz-${this.kernelVer}  ${this.tftpRoot}/${this.distroName}`
    );
    utils.exec(`chmod -R 777  ${this.tftpRoot}`);
  }

  initramfs() {
    console.log(`### creazione initramfs ###`);

    let conf = `/etc/initramfs-tools/initramfs.conf`;
    let initrdFile = `/tmp/initrd.img-${this.kernelVer}`;

    let search = "MODULES=most";
    let replace = "MODULES=netboot";
    utils.sr(conf, search, replace);

    search = "BOOT=local";
    replace = "BOOT=nfs";
    utils.sr(conf, search, replace);

    utils.exec(`mkinitramfs -o /tmp/initrd.img-${this.kernelVer}`);

    console.log(`### Copia di initrd.img-${this.kernelVer} ###`);
    utils.exec(`cp ${initrdFile}  ${this.tftpRoot}/${this.distroName}`);
    console.log(`### file initramfs ###`);
  }

  pxelinux() {
    utils.exec(`mkdir -p ${this.tftpRoot}/pxelinux.cfg`);
    let file = `${this.tftpRoot}/pxelinux.cfg/default`;
    let text = `# Generated by eggs
DEFAULT vesamenu.c32
TIMEOUT 600
ONTIMEOUT BootLocal
PROMPT 0
KBDMAP it.kbd
DISPLAY display.txt
SAY Uso la tastiera e locale per italiano.
MENU TITLE Tux's eggs
MENU BACKGROUND eggs.png

LABEL ${this.distroName}
MENU LABEL ${this.distroName}
KERNEL ${this.distroName}/vmlinuz-${this.kernelVer}
APPEND root=/dev/nfs initrd=${this.distroName}/initrd.img-${this
      .kernelVer} nfsroot=${this.netBootServer}:${this.fsDir} ip=dhcp rw
IPAPPEND 3
TEXT HELP
Distribuzione con boot remoto ${this.distroName}
ENDTEXT
# parametro per eth0 net.ifnames=0
#LABEL ========================================================================
#LABEL Avvio da immagini ISO con memdisk - Selezionare immagine desiderata
#LABEL ========================================================================
#LABEL WinXP over HTTP
#	MENU LABEL WinXP over HTTP
#		LINUX /memdisk
#		INITRD /iso/WinXP.iso
#		APPEND iso

LABEL ========================================================================
LABEL Boot locale
localboot 0
TEXT HELP
Esegue il boot dal disco locale
ENDTEXT

include common.cfg`;

    utils.bashwrite(file, text);

    utils.exec(`ln /usr/lib/PXELINUX/pxelinux.0  ${this.tftpRoot}/pxelinux.0`);
    utils.exec(
      `ln /usr/lib/PXELINUX/lpxelinux.0  ${this.tftpRoot}/lpxelinux.0`
    );
    utils.exec(`ln src/assets/eggs.jpg ${this.tftpRoot}/eggs.jpg`);

    utils.exec(
      `ln /usr/lib/syslinux/modules/bios/vesamenu.c32 ${this
        .tftpRoot}/vesamenu.c32`
    );
    utils.exec(
      `ln /usr/lib/syslinux/modules/bios/ldlinux.c32 ${this
        .tftpRoot}/ldlinux.c32`
    );
    utils.exec(
      `ln /usr/lib/syslinux/modules/bios/libcom32.c32 ${this
        .tftpRoot}/libcom32.c32`
    );
    utils.exec(
      `ln /usr/lib/syslinux/modules/bios/libutil.c32 ${this
        .tftpRoot}/libutil.c32`
    );
    utils.exec(`ln /usr/lib/syslinux/memdisk ${this.tftpRoot}/memdisk`);
  }

  exports() {
    let file = `/etc/exports`;
    let text = `${this.fsDir} ${this.net}/${this
      .netNetmask}(rw,no_root_squash,async,no_subtree_check)
# >>> Attenzione NON lasciare spazi tra le opzioni nfs <<<`;

    utils.bashwrite(file, text);
  }

  dnsmasq() {
    let file = `/etc/dnsmasq.conf`;
    let text = `
interface=${this.netDeviceName}
domain=lan
dhcp-range=${this.net}, proxy, ${this.netNetmask}
pxe-service=x86PC, "Eggs and penguins...", pxelinux
enable-tftp
port=0
tftp-root=${this.tftpRoot}
# IF dhcp-match=set:ipxe,175 THEN
dhcp-match=set:ipxe,175 # iPXE sends a 175 option.
      dhcp-boot=tag:!ipxe,undionly.kpxe
#ELSE
      dhcp-boot=http://${this.netBootServer}/lpxelinux.0
# ENDIF`;

    utils.bashwrite(file, text);
  }

  install() {
    utils.exec(`apt-get update`);
    utils.exec(
      `apt-get install nfs-kernel-server dnsmasq apache2 syslinux pxelinux -y`
    );
  }

  purge() {
    utils.exec(
      `apt-get remove --purge nfs-kernel-server dnsmasq apache2 syslinux pxelinux -y`
    );
  }
}
export default Netboot;
