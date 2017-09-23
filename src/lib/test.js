"use strict";
import utils from "./utils.js";
import fs from "fs";
var inquirer = require("inquirer");
var drivelist = require("drivelist");

module.exports.start = async function(time) {
  console.log("test: start");
  let varDrives = await drives();
  let driveList = [];
  for (var key in varDrives) {
    driveList.push(varDrives[key].device);
    console.log(varDrives[key].device);
  }
  console.log("test: end");
}

function drives() {
  return new Promise(function(resolve, reject) {
    drivelist.list((error, drives) => {
      if (error) {
        reject(error);
      }
      resolve(drives);
    });
  });
}
