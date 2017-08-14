// apt-get instal nfs-kernel-server dnsmasq apache2 syslinux pxelinux

"use strict";

import Rsync from "./Rsync.js";
import Fabricator from "./fabricator.js";
let shell = require("shelljs");
let fs = require("fs");

class Eggs extends Fabricator {
  constructor(homeDir = "/home/artisan/fabricator", distroName = "default") {
    super(homeDir, distroName);

    // Variabili Eggs
    this._distroName = distroName; // $CLIENT_HOSTNAME
    this._clientUserFullName = "Artisan"; // $CLIENT_USERFULLNAME
    this._clientUserName = "artisan"; // $CLIENT_USERNAME
    this._clientPassword = "evoluzione"; // $CLIENT_PASSWORD
    this._clientIpAddress = "192.168.0.254"; //$IPADDRESS

    this._netDomainName = "lan"; // $CLIENTDOMAIN
    this._net = "192.168.0.0";
    this._netBootServer = "192.168.0.5";
    this._tftpRoot = "/var/www/html";
    this._netNetmask = "255.255.255.0";
    this._netGateway = "192.168.0.1";
    this._netDns = "192.168.0.1";

    this._homeDir = homeDir;
    this._fsDir = `${homeDir}/fs`;
    this._distroName = distroName;

    // this._netDeviceName = "eth0";
    this._netDeviceName = "ens18";
    // this._kernelVer = "3.16.0-4-amd64";
    this._kernelVer = "4.9.0-3-amd64";
  }

  eggsErase() {
    console.log("==========================================");
    console.log("eggsErase");
    console.log("==========================================");
    shell.rm(`-rf`, this._tftpRoot);
    console.log("eggsErase END");
  }
  fstab() {
    let file = `${this._fsDir}/etc/fstab`;
    let text = `# Generated by eggs
proc /proc proc defaults 0 0
/dev/nfs / nfs defaults 1 1

none /tmp tmpfs defaults 0 0
none /var/run tmpfs defaults 0 0
none /var/lock tmpfs defaults 0 0
none /var/tmp tmpfs defaults 0 0`;

    writeAndShow(file, text);
  }

  hostname() {
    let file = `${this._fsDir}/etc/hostname`;
    let text = this._distroName;
    writeAndShow(file, text);
  }

  resolvConf() {
    let file = `${this._fsDir}/etc/resolv.conf`;
    let text = `# Generated by eggs
search localdomain.dom
nameserver ${this._netDns}`;

    writeAndShow(file, text);
  }

  resolvConfDBase() {
    let file = `${this._fsDir}/etc/resolvconf/resolv.conf.d/base`;
    let text = `### Generated by eggs
search localdomain.dom
nameserver ${this._netDns}`;

    writeAndShow(file, text);
  }
  interfaces() {
    let file = `${this._fsDir}/etc/network/interfaces`;
    let text = `
# Generated by eggs
auto lo
iface lo inet loopback
iface this._netDeviceName inet manual`;

    writeAndShow(file, text);
  }

  hosts() {
    let file = `${this._fsDir}/etc/hosts`;
    let text = `# Generated by eggs
127.0.0.1 localhost.localdomain localhost ${this._distroName}
${this._clientIpAddress} ${this._distroName}.${this._netDomainName} ${this
      ._distroName}

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts`;

    writeAndShow(file, text);
  }

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

  tempInstallerRun() {
    console.log("### Avvio di tempinstaller ###");

    execAndShow(`mount -o bind /proc ${this._fsDir}/proc`);
    execAndShow(`mount -o bind /dev ${this._fsDir}/dev`);
    execAndShow(`mount -o bind /sys ${this._fsDir}/sys`);

    execAndShow(`chroot ${this._fsDir} ./tempinstaller`);

    execAndShow(`sleep 1`);
    execAndShow(`umount ${this._fsDir}/proc`);

    execAndShow(`sleep 1`);
    execAndShow(`umount ${this._fsDir}/dev`);

    execAndShow(`sleep 1`);
    execAndShow(`umount ${this._fsDir}/sys`);
    execAndShow(`sleep 1`);

    console.log("### Fine esecuzione di tempinstaller ###");
  }

  vmlinuz() {
    execAndShow(`mkdir ${this._tftpRoot}/${this._distroName}`);
    console.log(`### Copia di vmlinuz-${this._kernelVer} ###`);
    execAndShow(
      `cp /boot/vmlinuz-${this._kernelVer}  ${this._tftpRoot}/${this
        ._distroName}`
    );
    execAndShow(`chmod -R 777  ${this._tftpRoot}`);
  }

  initramfs() {
    /*
    Change the boot flad to nfs in /etc/inittramfs-tools/inittramfs
    */
    let file = `/etc/initramfs-tools/initramfs.conf`;
    let search = "MODULES=most";
    let replace = "MODULES=netboot";
    console.log(`### creazione initramfs ###`);
    fileEdit(file, search, replace);

    search = "BOOT=most";
    replace = "BOOT=local";
    fileEdit(file, search, replace);

    execAndShow(`mkinitramfs -o /initrd.img-${this._kernelVer}`);
    console.log(`### Copia di initrd.img-${this._kernelVer} ###`);
    execAndShow(
      `cp ${this._fsDir}/initrd.img-${this._kernelVer}  ${this._tftpRoot}/${this
        ._distroName}`
    );
    console.log(`### file initramfs ###`);
  }

  pxelinux() {
    execAndShow(`mkdir -p ${this._tftpRoot}/pxelinux.cfg`);
    let file = `${this._tftpRoot}/pxelinux.cfg/default`;
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

LABEL ${this._distroName}
MENU LABEL ${this._distroName}
KERNEL ${this._distroName}/vmlinuz-${this._kernelVer}
APPEND root=/dev/nfs initrd=${this._distroName}/initrd.img-${this
      ._kernelVer} nfsroot=${this._netBootServer}:${this._fsDir} ip=dhcp rw
IPAPPEND 3
TEXT HELP
Distribuzione con boot remoto ${this._distroName}
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

    writeAndShow(file, text);

    shell.exec(`ln /usr/lib/PXELINUX/pxelinux.0  ${this._tftpRoot}/pxelinux.0`);
    shell.exec(
      `ln /usr/lib/PXELINUX/lpxelinux.0  ${this._tftpRoot}/lpxelinux.0`
    );
    shell.exec(`ln src/assets/wallpaper.png ${this._tftpRoot}/wallpaper.png`);

    shell.exec(
      `ln /usr/lib/syslinux/modules/bios/vesamenu.c32 ${this
        ._tftpRoot}/vesamenu.c32`
    );
    shell.exec(
      `ln /usr/lib/syslinux/modules/bios/ldlinux.c32 ${this
        ._tftpRoot}/ldlinux.c32`
    );
    shell.exec(
      `ln /usr/lib/syslinux/modules/bios/libcom32.c32 ${this
        ._tftpRoot}/libcom32.c32`
    );
    shell.exec(
      `ln /usr/lib/syslinux/modules/bios/libutil.c32 ${this
        ._tftpRoot}/libutil.c32`
    );
    shell.exec(`ln /usr/lib/syslinux/memdisk ${this._tftpRoot}/memdisk`);
  }

  exports() {
    let file = `/etc/exports`;
    let text = `
      # Generated by Eggs
      ${this._fsDir} ${this._net}/${this
      ._netNetmask}(rw,no_root_squash,async,no_subtree_check)
      ### Attenzione NON lasciare spazi tra le opzioni ###`;

    writeAndShow(file, text);
  }

  dnsmasq() {
    let file = `/etc/dnsmasq.conf`;
    let text = `
interface=${this._netDeviceName}
domain=lan
dhcp-range=${this._net}, proxy, ${this._netNetmask}
pxe-service=x86PC, "Eggs and penguins...", pxelinux
enable-tftp
port=0
tftp-root=${this._tftpRoot}
# IF dhcp-match=set:ipxe,175 THEN
  dhcp-match=set:ipxe,175 # iPXE sends a 175 option.
        dhcp-boot=tag:!ipxe,undionly.kpxe
#ELSE
        dhcp-boot=http://${this._netBootServer}/lpxelinux.0
# ENDIF`;

    writeAndShow(file, text);
  }
}

function writeAndShow(file, text) {
  console.log(`### Creazione ${file}  ###`);
  console.log(text);
  fs.writeFile(file, text, function(err) {
    if (err) {
      console.log(`Errore durante la scrittura di ${file}, errore: ${err}`);
    }
  });
  console.log(`### Fine creazione ${file}  ###`);
}

function execAndShow(cmd) {
  console.log(cmd);
  shell.exec(cmd);
}

function fileEdit(file, search, replace) {
  fs.readFile(file, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    let result = data.replace(search, replace);
    fs.writeFile(file, result, "utf8", function(err) {
      if (err) return console.log(err);
    });
  });
}
export default Eggs;
