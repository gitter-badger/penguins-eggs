"use strict";

import Rsync from "./Rsync.js";
let shell = require("shelljs");
let fs = require("fs");

class System {
  constructor(homeDir = "/home/artisan/fabricator", distroName = "Fabricator") {
    this._homeDir = homeDir;
    this._workDir = homeDir + "/workdir";
    this._fsDir = homeDir + "/fs";
    this._distroName = distroName;
  }

  systemCopy() {
    console.log("==========================================");
    console.log("systemCopy");
    console.log("==========================================");

    let aCommands = [];
    aCommands.push(
      `rsync -av / ${this._fsDir} --exclude="${this
        ._homeDir}" --exclude-from="./src/lib/fabricator_excludes" --delete-before --delete-excluded`
    );

    Rsync(aCommands);
    return aCommands;
  }

  systemClean() {
    console.log("==========================================");
    console.log("systemClean");
    console.log("==========================================");
    shell.rm("-rf", `${this._fsDir}/etc/group`);
    shell.rm("-rf", `${this._fsDir}/etc/group-`);
    shell.rm("-rf", `${this._fsDir}/etc/passwd`);
    shell.rm("-rf", `${this._fsDir}/etc/passwd-`);
    shell.rm("-rf", `${this._fsDir}/etc/shadow`);
    shell.rm("-rf", `${this._fsDir}/etc/shadow-`);
    shell.rm("-rf", `${this._fsDir}/etc/gshadow`);
    shell.rm("-rf", `${this._fsDir}/etc/gshadow-`);
    shell.rm("-rf", `${this._fsDir}/etc/wicd/wired-settings.conf`);
    shell.rm("-rf", `${this._fsDir}/etc/NetworkManager/system-connections/*`);
    shell.rm("-rf", `${this._fsDir}/etc/printcap`);
    shell.rm("-rf", `${this._fsDir}/etc/cups/printers.conf`);
    shell.touch(`${this._fsDir}/etc/cups/printcap`);
    shell.touch(`${this._fsDir}/etc/cupsprinters.conf`);
    shell.rm("-rf", `${this._fsDir}/var/cache/gdm/*`);
    shell.rm("-rf", `${this._fsDir}/var/lib/sudo/*`);
    shell.rm("-rf", `${this._fsDir}/var/run/console/*`);
    shell.rm("-rf", `${this._fsDir}/var/lib/kdm/kdmsts`);
    shell.rm("-rf", `${this._fsDir}/etc/gdm/gdm.conf-custom`);
    shell.rm("-rf", `${this._fsDir}/etc/gdm/custom.conf`);
    shell.rm("-rf", `${this._fsDir}/etc/cups/ssl/server.crt`);
    shell.rm("-rf", `${this._fsDir}/etc/cups/ssl/server.key`);
    shell.rm("-rf", `${this._fsDir}/etc/ssh/ssh_host_rsa_key`);
    shell.rm("-rf", `${this._fsDir}/etc/ssh/ssh_host_dsa_key.pub`);
    shell.rm("-rf", `${this._fsDir}/etc/ssh/ssh_host_dsa_key`);
    shell.rm("-rf", `${this._fsDir}/etc/ssh/ssh_host_rsa_key.pub`);

    //further cleanup
    shell.rm("-rf", `${this._fsDir}/var/cache/gdm/*`);
    shell.rm("-rf", `${this._fsDir}/var/tmp/kdecache*`);
    shell.rm("-rf", `${this._fsDir}/var/spool/gfax/*`);
    shell.rm("-rf", `${this._fsDir}/var/run/gdm3/*`);
    shell.rm("-rf", `${this._fsDir}/var/lib/sudo/*`);
  }

  systemEdit() {
    console.log("==========================================");
    console.log("systemEdit");
    console.log("==========================================");

    // Truncate logs, remove archived logs
    let cmd = `find ${this
      ._fsDir}/var/log -name "*gz" -print0 | xargs -0r rm -f`;
    console.log(cmd);
    shell.exec(cmd, { silent: true });

    cmd = `find ${this._fsDir}/var/log/ -type f -exec truncate -s 0 {} \;`;
    console.log(cmd);
    shell.exec(cmd, { silent: true });

    // Allow all fixed drives to be mounted with pmount

    // Clear list of recently used files in geany for primary user.

    //  Enable or disable password login through ssh for users (not root)
    // Remove obsolete live-config file

    // etc/fstab should exist, even if it's empty,
    shell.touch(`${this._fsDir}/etc/fstab`);

    // Blank out systemd machine id. If it does not exist, systemd-journald
    // will fail, but if it exists and is empty, systemd will automatically
    // set up a new unique ID.
    shell.touch(`${this._fsDir}/etc/machine-id`);

    // add some basic files to /dev
    shell.exec(`mknod -m 622 ${this._fsDir}/dev/console c 5 1`);
    shell.exec(`mknod -m 666 ${this._fsDir}/dev/null c 1 3`);
    shell.exec(`mknod -m 666 ${this._fsDir}/dev/zero c 1 5`);
    shell.exec(`mknod -m 666 ${this._fsDir}/dev/ptmx c 5 2`);
    shell.exec(`mknod -m 666 ${this._fsDir}/dev/tty c 5 0`);
    shell.exec(`mknod -m 444 "${this._fsDir}/dev/random c 1 8`);
    shell.exec(`mknod -m 444 ${this._fsDir}/dev/urandom c 1 9`);
    // tty->console/ptmx/tty
    shell.exec(`chown -v root:tty ${this._fsDir}/dev/console`);
    shell.exec(`chown -v root:tty ${this._fsDir}/dev/ptmx`);
    shell.exec(`chown -v root:tty ${this._fsDir}/dev/tty`);

    shell.exec(`ln -sv /proc/self/fd ${this._fsDir}/dev/fd`);
    shell.exec(`ln -sv /proc/self/fd/0 ${this._fsDir}/dev/stdin`);
    shell.exec(`ln -sv /proc/self/fd/1 ${this._fsDir}/dev/stdout`);
    shell.exec(`ln -sv /proc/self/fd/2 ${this._fsDir}/dev/stderr`);
    shell.exec(`ln -sv /proc/kcore ${this._fsDir}/dev/core`);
    shell.exec(`ln -sv /run/shm ${this._fsDir}/dev/shm`);
    shell.mkdir(`${this._fsDir}/dev/pts`);

    // Clear configs from /etc/network/interfaces, wicd and NetworkManager
    //  and netman, so they aren't stealthily included in the snapshot.
    shell.rm(`${this._fsDir}/etc/network/interfaces`);
    shell.rm(`${this._fsDir}/var/lib/wicd/configurations/*`);
    shell.rm(`${this._fsDir}/etc/wicd/wireless-settings.conf`);
    shell.rm(`${this._fsDir}/etc/NetworkManager/system-connections/`);
    shell.rm(`${this._fsDir}/etc/network/wifi/*`);
  }

  systemIsoName() {
    console.log("==========================================");
    console.log("systemIsoName");
    console.log("==========================================");

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${this
      ._distroName}-${year}-${month}-${day}-at-${hours}-${minutes}.iso`;
  }
}

export default System;
