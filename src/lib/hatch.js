"use strict";
import utils from "./utils.js";
import fs from "fs";
const inquirer = require("inquirer");
const drivelist = require("drivelist");

exports.hatch = await function () {
  console.log("dovrebbe andar...");
  let varDrives = Drives();
  let driveList = [];
  for (var key in varDrives) {
    //console.log(varDrives[key].device);
    driveList.push(varDrives[key].device);
  }
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
      tyoe: "input",
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
      tyoe: "input",
      name: "netGateway",
      message: "Insert gateway: ",
      default: "192.168.0.1",
      when: function(answers) {
        return answers.netAddressType === "static";
      }
    },
    {
      tyoe: "input",
      name: "netDns",
      message: "Insert DNS: ",
      default: "192.168.0.1",
      when: function(answers) {
        return answers.netAddressType === "static";
      }
    },
    {
      type: "list",
      name: "installationDisk",
      message: "Select the installation disk: ",
      choices: driveList,
      default: driveList[0]
    },
    {
      type: "list",
      name: "fsType",
      message: "Select the format type: ",
      choices: ["ext2", "ext3", "ext4"],
      default: "ext4"
    }
  ];
  inquirer.prompt(questions).then(config);
};

function Drives() {
  return new Promise(function(resolve, reject) {
    drivelist.list((error, drives) => {
      if (error) {
        reject(error);
      }
      resolve(drives);
    });
  });
}

var config = function(data) {
  let questions;
  if (!isLive()) {
    questions = {
      type: "list",
      name: "bootedFromIso",
      message: "Error: cannot hatching an installed penguin!",
      choices: ["OK"]
    };
    inquirer.prompt(questions).then(process.exit(0));
  }

  questions = {
    type: "list",
    name: "confirm",
    message: `Attention:\nthis installer will completely destroy your disk ${data.installationDisk}!\nAre you sure?`,
    choices: ["No", "Yes"],
    default: "No"
  };
  inquirer.prompt(questions).then(confirm);
};

var exec = require("child_process").exec;
function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    callback(stdout);
  });
}

var confirm = function(data) {
  if ((data.confirm = "No")) {
    process.exit(0);
  }
};

function isLive() {
  execute(`./scripts/is_live.sh`, out => {
    console.log(out);
  });
  return out;
}

var ifaces = fs.readdirSync("/sys/class/net/");
