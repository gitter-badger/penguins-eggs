"use strict";
import utils from "./utils.js";
import fs from "fs";
const inquirer = require("inquirer");
const drivelist = require("drivelist");

export async function hatch() {
  let target="/TARGET";
  let devices={
      "root" : {
        "device" : "/dev/pve/root",
        "fstype" : "ext4",
        "mountPoint" : "/"
      },
      "boot" : {
        "device" : "/dev/sda1",
        "fstype" : "vfat",
        "mountPoint" : "/boot"
      },
      "data" : {
        "device" : "/dev/pve/data",
        "fstype" : "ext4",
        "mountPoint" : "/var/lib/vz"
      },
      "swap" : {
        "device" : "/dev/pve/swap",
        "fstype" : "swap",
        "mountPoint" : "none"
      }
    };
  //console.log(devices);


  let isLive;
  console.log("isLive");
  isLive = await getIsLive();
  console.log(`hatch isLive: ${isLive}`);

  let driveList;
  driveList = await getDrives();
  console.log(`hatch driveList: ${driveList}`);

  let varOptions;
  varOptions = await getOptions(driveList);
  console.log(`hatch options: ${varOptions}`);
  let options = JSON.parse(varOptions);

  let isDiskPreoared;
  isDiskPreoared = await diskPrepare(options.installationDevice);
  console.log(`hatch isDiskPreoared: ${isDiskPreoared}`);

  let diskSize;
  diskSize = await getDiskSize(options.installationDevice);
  console.log(`hatch diskSize: ${diskSize} Byte, equal at ${Math.round(diskSize/1024/1024/1024)} GB`);

  let isPartitionBootPrepared;
  isPartitionBootPrepared=await diskPreparePartitionBoot(options.installationDevice);
  console.log(`hatch isPartitionBootPrepared: ${isPartitionBootPrepared}`);

  await diskPreparePartitionLvm(options.installationDevice, Math.floor(diskSize/1024/1024));
  await diskPreparePve(options.installationDevice);
  await mkfs(devices);
  await mount(target, devices);
  await rsync(target);
  await fstab(target, devices);
  //{"username":"artisan","userfullname":"artisan","userpassword":"evolution","rootpassword":"evolution","hostname":"eggs-ve-test","domain":"lan","netInterface":"ens18","netAddressType":"dhcp","installationDevice":"/dev/sda","fsType":"ext4"}

  await hostname(target, options.hostname);
  await resolvConf(target, options.domain, "192.168.0.1");
  await interfaces(target, options.netInterfaces,options.netAddressType);
  await hosts(target, options.hostname, options.domain);
  await mount4chroot(target);
  await mkinitramfs(target);
  await grubInstall(target, options.installationDevice);
  await umount4chroot(target);
  await umount(target, devices);
}

async function grubInstall(target, device){
  await execute(`chroot ${target} grub-install ${device}`);
  await execute(`chroot ${target} update-grub`);
}


async function mkinitramfs(target){
  await execute(`chroot ${target} mkinitramfs -k -o /tmp/initramfs-$(uname -r)`);
  await execute(`cp ${target}/tmp/initramfs-$(uname -r) /TARGET/boot`);
}


async function mount4chroot(target){
  await execute(`mount -o bind /proc ${target}/proc`);
  await execute(`mount -o bind /dev ${target}/dev`);
  await execute(`mount -o bind /sys ${target}/sys`);
  await execute(`mount -o bind /run ${target}/run`);
}
async function umount4chroot(target){
  await execute(`umount ${target}/proc`);
  await execute(`sleep 1`);
  await execute(`umount ${target}/dev`);
  await execute(`sleep 1`);
  await execute(`umount ${target}/sys`);
  await execute(`sleep 1`);
  await execute(`umount ${target}/run`);
  await execute(`sleep 1`);
}


async function   fstab(target, devices) {
    let file = `${target}/etc/fstab`;
    let text = `
proc /proc proc defaults 0 0
${devices.root.device} ${devices.root.mountPoint} ${devices.root.fstype} relatime,errors=remount-ro 0 1
${devices.boot.device} ${devices.boot.mountPoint} ${devices.boot.fstype} relatime 0 0
${devices.data.device} ${devices.data.mountPoint} ${devices.data.fstype} relatime 0 0
${devices.swap.device} ${devices.swap.mountPoint} ${devices.swap.fstype} sw 0 0`;

  utils.bashwrite(file, text);
}

async function hostname(target, hostname) {
    let file = `${target}/etc/hostname`;
    let text = hostname;
    utils.bashwrite(file, text);
}

async function resolvConf(target, domain, dns) {
    let file = `${target}/etc/resolv.conf`;
    let text = `
search ${domain}
nameserver ${dns}
nameserver 8.8.8.8
nameserver 8.8.4.4
`;
  utils.bashwrite(file, text);
}

async function interfaces(target, netInterface, addressType) {
    let file = `${target}/etc/network/interfaces`;
    let text = `
auto lo
iface lo inet loopback
iface ${netInterface} inet ${addressType}
`;

  utils.bashwrite(file, text);
}

async function  hosts(target, hostname, domain) {
    let file = `${target}/etc/hosts`;
    let text = `
127.0.0.1 localhost.localdomain localhost ${hostname} ${hostname}.${domain}
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

async function getIsLive() {
  let result;
  console.log("function: getIsLive");
  result = await execute(`./scripts/is_live.sh`);
  console.log("result: result");
  return result;
}

async function rsync(target){
    console.log(`rsync -a / ${target} --exclude-from ./scripts/excludes.list`);
    await execute(`rsync -a / ${target} --exclude-from ./scripts/excludes.list`);
}

async function mkfs(devices){
  let result=true;
  await execute(`mkfs -t ${devices.root.fstype} ${devices.root.device}`);
  await execute(`mkfs -t ${devices.boot.fstype} ${devices.boot.device}`);
  await execute(`mkfs -t ${devices.data.fstype} ${devices.data.device}`);
  await execute(`mkswap ${devices.swap.device}`);
  return result;
}

async function mount(target, devices){
  await execute(`mkdir ${target}`);
  await execute(`mount ${devices.root.device} ${target}`);
  await execute(`mkdir ${target}/boot`);
  await execute(`mount ${devices.boot.device} ${target}/boot`);
  await execute(`mkdir -p ${target}/var/lib/vz`);
  await execute(`mount ${devices.data.device} ${target}/var/lib/vz`);
  return true;
}

async function umount(target, devices){
  await execute(`umount ${devices.data.device} ${target}/var/lib/vz`);
  await execute(`umount ${devices.boot.device} ${target}boot`);
  await execute(`umount ${devices.root.device} ${target}`);
  await execute(`rmdir ${target} -rf`);
  return true;
}

async function diskPreparePve(device){
  await execute(`./scripts/disk_prepare_pve.sh ${device}`);
  return true;
}

async function diskPreparePartitionLvm(device,sizeMb){
  console.log(`./scripts/disk_prepare_partition_lvm.sh ${device} ${sizeMb}`);
  await execute(`./scripts/disk_prepare_partition_lvm.sh ${device} ${sizeMb}`);
  return true;
}
async function diskPreparePartitionBoot(device){
  await execute(`./scripts/disk_prepare_partition_boot.sh ${device}`);
  return true;
}

async function diskPrepare(device) {
  await execute(`./scripts/disk_prepare.sh ${device}`);
  return true;
}

async function getDiskSize(device) {
  let result="";
  result = await execute(`./scripts/disk_get_size.sh ${device}`);
  result=result.replace("B","").trim();
  return result;
}

function execute(command) {
  return new Promise(function(resolve, reject) {
    var exec = require("child_process").exec;
    exec(command, function(error, stdout, stderr) {
      resolve(stdout);
    });
  });
}

function getDrives() {
  return new Promise(function(resolve, reject) {
    let aDriveList = [];
    drivelist.list((error, drives) => {
      if (error) {
        reject(error);
      }
      for (var key in drives) {
        aDriveList.push(drives[key].device);
      }
      resolve(aDriveList);
    });
  });
}

async function getOptions(driveList) {
  return new Promise(function(resolve, reject) {
    var questions = [
      {
        type: "input",
        name: "username",
        message: "user name: ",
        default: "artisan"
      },
      {
        type: "input",
        name: "userfullname",
        message: "user full name: ",
        default: "artisan"
      },
      {
        type: "password",
        name: "userpassword",
        message: "Enter a password for the user :",
        default: "evolution"
      },
      {
        type: "password",
        name: "rootpassword",
        message: "Enter a password for root :",
        default: "evolution"
      },
      {
        type: "input",
        name: "hostname",
        message: "hostname: ",
        default: "eggs-ve-test"
      },
      {
        type: "input",
        name: "domain",
        message: "domain name: ",
        default: "lan"
      },
      {
        type: "list",
        name: "netInterface",
        message: "Select the network interface: ",
        choices: ifaces
      },
      {
        type: "list",
        name: "netAddressType",
        message: "Select the network type: ",
        choices: ["dhcp", "static"],
        default: "dhcp"
      },
      {
        type: "input",
        name: "netAddress",
        message: "Insert IP address: ",
        default: "192.168.0.2",
        when: function(answers) {
          return answers.netAddressType === "static";
        }
      },
      {
        type: "input",
        name: "netMask",
        message: "Insert netmask: ",
        default: "255.255.255.0",
        when: function(answers) {
          return answers.netAddressType === "static";
        }
      },
      {
        type: "input",
        name: "netGateway",
        message: "Insert gateway: ",
        default: "192.168.0.1",
        when: function(answers) {
          return answers.netAddressType === "static";
        }
      },
      {
        type: "input",
        name: "netDns",
        message: "Insert DNS: ",
        default: "192.168.0.1",
        when: function(answers) {
          return answers.netAddressType === "static";
        }
      },
      {
        type: "list",
        name: "installationDevice",
        message: "Select the installation disk: ",
        choices: driveList,
        default: driveList[0]
      },
      {
        type: "list",
        name: "fsType",
        message: "Select format type: ",
        choices: ["ext2", "ext3", "ext4"],
        default: "ext4"
      }
    ];
    inquirer.prompt(questions).then(function(options) {
      resolve(JSON.stringify(options));
    });
  });
}

//disk_prepare;
//disk_get_size;
//partition_prepare_boot;
//partition_prepare_lvm;
//pve_prepare;

var ifaces = fs.readdirSync("/sys/class/net/");
