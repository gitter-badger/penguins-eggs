/*
  Netboot.js V. 0.3.0
*/

"use strict";
import os from "os";
import fs from "fs";
import ip from "ip";
import network from "network";
import Utils from "./Utils.js";

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

    this.kernelVer = Utils.kernerlVersion();

    this.netDeviceName = Utils.netDeviceName();
    this.netBootServer = Utils.netBootServer();
    this.netDeviceName = Utils.netDeviceName();
    this.netDns = Utils.netDns();
    this.netGateway = Utils.netGateway();
    this.netDomainName = Utils.netDomainName();
    this.netNetmask = Utils.netNetmask();
    this.net = Utils.net(this.netBootServer, this.netNetmask);

    this.tftpRoot = "/var/www/html";
  }

  inspect() {
    console.log("Eggs ha rilevato questi parametri:");
    console.log(">>> kernelVer: " + this.kernelVer);
    console.log(">>> netBootServer: " + this.netBootServer);
    console.log(">>> netDeviceName: " + this.netDeviceName);
    console.log(">>> netDns: " + this.netDns);
    console.log(">>> netGateway: " + this.netGateway);
    console.log(">>> netDomainName: " + this.netDomainName);
    console.log(">>> netNetmask: " + this.netNetmask);
    console.log(">>> net: " + Utils.net(this.netBootServer, this.netNetmask));
  }

  create() {
    console.log("==========================================");
    console.log("Incubator netboot: create");
    console.log("==========================================");
    if (!fs.existsSync(this.tftpRoot)) {
      Utils.exec(`mkdir -p ${this.tftpRoot}`);
    }
  }

  erase() {
    console.log("==========================================");
    console.log("Incubator netboot: erase");
    console.log("==========================================");
    Utils.exec(`rm -rf ${this.tftpRoot}`);
  }

  vmlinuz() {
    Utils.exec(`mkdir -p ${this.tftpRoot}/${this.distroName}`);
    console.log(`### Copia di vmlinuz-${this.kernelVer} ###`);
    Utils.exec(
      `cp /boot/vmlinuz-${this.kernelVer}  ${this.tftpRoot}/${this.distroName}`
    );
    Utils.exec(`chmod -R 777  ${this.tftpRoot}`);
  }

  initramfs() {
    console.log(`### creazione initramfs ###`);

    let conf = `/etc/initramfs-tools/initramfs.conf`;
    let initrdFile = `/tmp/initrd.img-${this.kernelVer}`;

    let search = "MODULES=most";
    let replace = "MODULES=netboot";
    Utils.sr(conf, search, replace);

    search = "BOOT=local";
    replace = "BOOT=nfs";
    Utils.sr(conf, search, replace);

    Utils.exec(`mkinitramfs -o /tmp/initrd.img-${this.kernelVer}`);

    console.log(`### Copia di initrd.img-${this.kernelVer} ###`);
    Utils.exec(`cp ${initrdFile}  ${this.tftpRoot}/${this.distroName}`);
    console.log(`### file initramfs ###`);
  }

  pxelinux() {
    Utils.exec(`mkdir -p ${this.tftpRoot}/pxelinux.cfg`);
    let file = `${this.tftpRoot}/pxelinux.cfg/default`;
    let text = `# Generated by eggs
DEFAULT vesamenu.c32
TIMEOUT 600
ONTIMEOUT BootLocal
PROMPT 0
KBDMAP it.kbd
DISPLAY display.txt
SAY Uso la tastiera e locale per italiano.
MENU TITLE Giant-Turle
MENU BACKGROUND wallpaper.png

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

    Utils.bashwrite(file, text);

    Utils.exec(`ln /usr/lib/PXELINUX/pxelinux.0  ${this.tftpRoot}/pxelinux.0`);
    Utils.exec(
      `ln /usr/lib/PXELINUX/lpxelinux.0  ${this.tftpRoot}/lpxelinux.0`
    );
    Utils.exec(`ln src/assets/wallpaper.png ${this.tftpRoot}/wallpaper.png`);

    Utils.exec(
      `ln /usr/lib/syslinux/modules/bios/vesamenu.c32 ${this
        .tftpRoot}/vesamenu.c32`
    );
    Utils.exec(
      `ln /usr/lib/syslinux/modules/bios/ldlinux.c32 ${this
        .tftpRoot}/ldlinux.c32`
    );
    Utils.exec(
      `ln /usr/lib/syslinux/modules/bios/libcom32.c32 ${this
        .tftpRoot}/libcom32.c32`
    );
    Utils.exec(
      `ln /usr/lib/syslinux/modules/bios/libutil.c32 ${this
        .tftpRoot}/libutil.c32`
    );
    Utils.exec(`ln /usr/lib/syslinux/memdisk ${this.tftpRoot}/memdisk`);
  }

  exports() {
    let file = `/etc/exports`;
    let text = `${this.fsDir} ${this.net}/${this
      .netNetmask}(rw,no_root_squash,async,no_subtree_check)
# >>> Attenzione NON lasciare spazi tra le opzioni nfs <<<`;

    Utils.bashwrite(file, text);
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

    Utils.bashwrite(file, text);
  }

  install() {
    Utils.exec(`apt-get update`);
    Utils.exec(
      `apt-get install nfs-kernel-server dnsmasq apache2 syslinux pxelinux -y`
    );
  }

  purge() {
    Utils.exec(
      `apt-get remove --purge nfs-kernel-server dnsmasq apache2 syslinux pxelinux -y`
    );
  }
}
export default Netboot;
