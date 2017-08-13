/*
* Struttura ISO:  boot
*                 EFI
*                 isolinux
*                 live
*
*/
"use strict";

import System from "./System.js";
import Rsync from "./Rsync.js";

let shell = require("shelljs");
let fs = require("fs");

class Uefi extends System {
  constructor(homeDir = "/home/artisan/fabricator", distroName = "default") {
    super(homeDir, distroName);
    this._tempDir = homeDir + "/temp";
  }

  Uefi() {
    /*
    * EFI Extensible Firmware interfaces
    * UEFI Unified EFI Forum
    *
    */

    console.log("==========================================");
    console.log("Uefi");
    console.log("==========================================");

    // for initial grub.cfg
    let uefi_opt =
      "-eltorito-alt-boot -e boot/grub/efiboot.img -isohybrid-gpt-basdat -no-emul-boot";

    // Rimuovo workDir
    console.log(`rm -rf ${this._tempDir}`);
    shell.rm(`-rf`, this._tempDir);

    // Creo la struttura
    console.log(`mkdir -p ${this._tempDir}/boot/grub`);
    shell.mkdir(`-p`, `${this._tempDir}/boot/grub`);

    // #################################
    let bootFileCfg = `${this._tempDir}/boot/grub/grub.cfg`;
    let bootString = `
                  search --file --set=root /isolinux/isolinux.cfg
                  set prefix=(\$root)/boot/grub
                  source \$prefix/x86_64-efi/grub.cfg
  `;
    fs.writeFile(bootFileCfg, bootString, function(err) {
      console.log("Errore durante la scrittura di boot.cfg");
    });
    // fs: start with empty directories.
    console.log(`rm -rf ${this._fsDir}/boot`);
    shell.rm("-rf", `${this._fsDir}/boot`);
    console.log(`rm -rf ${this._fsDir}/efi`);
    shell.rm("-rf", `${this._fsDir}/efi`);
    console.log(`mkdir -p ${this._fsDir}/boot/grub/x86_64-efi`);
    shell.mkdir("-p", `${this._fsDir}/boot/grub/x86_64-efi`);
    console.log(`mkdir -p ${this._fsDir}/efi/boot`);
    shell.mkdir("-p", `${this._fsDir}/efi/boot`);

    // copy splash
    console.log(`cp ${this._condDir}/splash.png ${this._fsDir}/boot/grub`);
    shell.cp(`${this._condDir}/splash.png`, `${this._fsDir}/boot/grub`);

    // second grub.cfg file in /boot/grub/x86_64-efi/grub.cfg
    let cmd = `for i in $(ls /usr/lib/grub/x86_64-efi|grep part_|grep \.mod|sed 's/.mod//'); do echo "insmod $i" >> ${this
      ._fsDir}/boot/grub/x86_64-efi/grub.cfg; done`;
    console.log(cmd);
    shell.exec(cmd);

    // Additional modules so we don't boot in blind mode. I don't know which ones are really needed.
    cmd = `for i in efi_gop efi_uga ieee1275_fb vbe vga video_bochs video_cirrus jpeg png gfxterm ; do echo "insmod $i" >> ${this
      ._fsDir}/boot/grub/x86_64-efi/grub.cfg ; done`;
    console.log(cmd);
    shell.exec(cmd);
    cmd = `echo "source /boot/grub/grub.cfg" >> ${this
      ._fsDir}/boot/grub/x86_64-efi/grub.cfg`;
    console.log(cmd);
    shell.exec(cmd);

    // Entra in tempDir

    // make a tarred "memdisk" to embed in the grub image
    console.log(`tar -cvf memdisk boot`);
    shell.exec(`tar -cvf memdisk boot`);

    // make the grub image
    console.log(
      `grub-mkimage -O "x86_64-efi" -m "memdisk" -o "bootx64.efi" -p '(memdisk)/boot/grub' search iso9660 configfile normal memdisk tar cat part_msdos part_gpt fat ext2 ntfs ntfscomp hfsplus chain boot linux`
    );
    shell.exec(
      `grub-mkimage -O "x86_64-efi" -m "memdisk" -o "bootx64.efi" -p '(memdisk)/boot/grub' search iso9660 configfile normal memdisk tar cat part_msdos part_gpt fat ext2 ntfs ntfscomp hfsplus chain boot linux`
    );

    // copy the grub image to efi/boot (to go later in the devices root)
    console.log(`cp ${this._tempDir}/bootx64.efi efi/boot`);
    shell.cp(`${this._tempDir}/bootx64.efi`, `efi/boot`);

    // #######################
    // ## Do the boot image "boot/grub/efiboot.img"
    console.log(`dd if=/dev/zero of=boot/grub/efiboot.img bs=1K count=1440`);
    shell.exec(`dd if=/dev/zero of=boot/grub/efiboot.img bs=1K count=1440`);
    console.log(`/sbin/mkdosfs -F 12 boot/grub/efiboot.img`);
    shell.exec(`/sbin/mkdosfs -F 12 boot/grub/efiboot.img`);
    console.log(`mkdir img-mnt`);
    shell.exec(`mkdir img-mnt`);
    console.log(`mount -o loop boot/grub/efiboot.img img-mnt`);
    shell.exec(`mount -o loop boot/grub/efiboot.img img-mnt`);
    console.log(`mkdir -p img-mnt/efi/boot`);
    shell.exec(`mkdir -p img-mnt/efi/boot`);
    console.log(`cp ${this._tempDir}/bootx64.efi img-mnt/efi/boot/`);
    shell.cp(`${this._tempDir}/bootx64.efi`, `img-mnt/efi/boot/`);
    // #######################

    // copy modules and font
    console.log(`/usr/lib/grub/x86_64-efi/* ${this._tempDir}/grub/x86_64-efi/`);
    shell.cp(
      `/usr/lib/grub/x86_64-efi/*`,
      `${this._tempDir}boot/grub/x86_64-efi/`
    );

    // if this doesn't work try another font from the same place (grub's default, unicode.pf2, is much larger)
    //	Either of these will work, and they look the same to me. Unicode seems to work with qemu. -fsr
    // cp /usr/share/grub/ascii.pf2 boot/grub/font.pf2
    console.log(
      `cp /usr/share/grub/unicode.pf2 ${this._tempDir}/boot/grub/font.pf2`
    );
    shell.cp(
      `/usr/share/grub/unicode.pf2`,
      `${this._tempDir}/boot/grub/font.pf2`
    );

    // doesn't need to be root-owned
    console.log(`chown -R 1000:1000 $(pwd) 2>/dev/null`);
    shell.exec(`chown -R 1000:1000 $(pwd) 2>/dev/null`);

    // Cleanup efi temps
    console.log(`umount img-mnt`);
    shell.exec(`umount img-mnt`);
    console.log(`rm -rf img-mnt`);
    shell.rm(`-rf`, `img-mnt`);

    // Rumouve tempDir
    console.log(`rm -rf ${this._tempDir} NON EFFETTUATA!`);

    // Copy efi files to iso
    console.log(`rsync -avx ${this._tempDir}/boot ${this._workDir}/iso/`);
    shell.exec(`rsync -avx ${this._tempDir}/boot ${this._workDir}/iso/`);
    console.log(`rsync -avx "${this._tempDir}/efi  ${this._workDir}/iso/`);
    shell.exec(`rsync -avx "${this._tempDir}/efi  ${this._workDir}/iso/`);

    // Do the main grub.cfg (which gets loaded last):
    console.log(
      `${this._supportDir}/grub.cfg.template ${this
        ._workDir}/iso/boot/grub/grub.cfg`
    );
    shell.cp(
      `${this._supportDir}/grub.cfg.template`,
      `${this._workDir}/iso/boot/grub/grub.cfg`
    );
  }
}

export default Uefi;
