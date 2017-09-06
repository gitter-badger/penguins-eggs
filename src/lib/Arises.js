/*
  Arises.js V. 0.3.0
*/

"use strict";

//import shell from "shelljs";
//import fs from "fs";
//import os from "os";
//import dns from "dns";
import utils from "./utils.js";
//import drivelist from "drivelist";

class Arises {
  constructor(
    homeDir = "/srv/incubator",
    distroName,
    clientUserFullName,
    clientUserName,
    clientPassword
  ) {
    this.clientUserFullName = clientUserFullName;
    this.clientUserName = clientUserName;
    this.clientPassword = clientPassword;
    this.clientIpAddress = "127.0.1.1";

    this.kernelVer = utils.kernerlVersion();
    this.netDeviceName = utils.netDeviceName();
    this.netDomainName = "lan";
    this.netDns = utils.netDns();
  }

  setDestinationDrive() {

    console.log("Arises::setDestinationDrive()");
/*
    drivelist.list((error, drives) => {
      if (error) {
        throw error;
      }
      drives.forEach(drive => {
        console.log( drive);
      });
    });*/
  }

  partDrive(destinationdrive) {
    utils.exec(`lvremove pve`);
    utils.exec(`parted --script ${destinationdrive} mklabel msdos`);
    utils.exec(`sleep 1`);
    utils.exec(
      `parted -s ${destinationdrive} unit mb print free | grep Free | awk '{print $3}' | cut -d "M" -f1`
    );

    // Crea partizione boot
    utils.exec(`parted --script ${destinationdrive} mkpart primary ext4 1 512`);
    utils.exec(
      `parted --script --align optimal  ${destinationdrive} set 1 boot on`
    );
    utils.exec(`sleep 1`);

    // Crea partizione lvm
    utils.exec(
      `parted --script --align optimal ${destinationdrive} mkpart primary ext2 512 $HD_SIZE_MB`
    );
    utils.exec(`parted --script ${destinationdrive} set 2 lvm on`);
    utils.exec(`sleep 1`);

    //VM_PARTNAME=`fdisk /dev/$PARTDRIVE -l | grep 8e | awk '{print $1}' | cut -d "/" -f3`
    // LVM_SIZE=`cat /proc/partitions | grep $LVM_PARTNAME| awk '{print $3}' | grep "[0-9]"`
    // echo "LVM_SIZE=$LVM_SIZE"
    // LVM_SIZE=$(($LVM_SIZE/1024))
    // echo "LVM_SIZE=$LVM_SIZE"

    // PVE_SWAP="/dev/pve/swap"
    // PVE_ROOT="/dev/pve/root"
    // PVE_DATA="dev/pve/data"

    // # La partizione di root viene posta ad 1/4 della partizione LVM.
    // # Viene limitata fino ad un massimo di 100 GB

    // LVM_SWAP_SIZE=$((4*1024))
    // echo "LVM_SWAP_SIZE=$LVM_SWAP_SIZE"

    // LVM_ROOT_SIZE=$(($LVM_SIZE/8))
    // LVM_ROOT_SIZE_MINIMUN=8192
    // if [ $LVM_ROOT_SIZE  -le $LVM_ROOT_SIZE_MINIMUN ]; then
  }

  getParameters() {
    //--field="Nome utente completo" \
    //--field="Nome utente" \
    //--field="Password utente":H \
    //--field="Conferma password utente":H \
    //--field="Password per root":H \
    //--field="Conferma password per root":H \
    //--field="Nome dell\'host" \
    //--field="Dominio internet" \
    //--field="Indirizzo IP" \
    //--field="Maschera di rete" \
    //--field="Gateway" \
    //--field="DNS"`
  }
  setGrub() {}
  getZone() {}
}

export default Arises;
