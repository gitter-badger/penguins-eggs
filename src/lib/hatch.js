/*
  Arises.js V. 0.3.0
*/

"use strict";

//import shell from "shelljs";
//import fs from "fs";
//import os from "os";
//import dns from "dns";
//import utils from "./utils.js";
//import drivelist from "drivelist";
const inquirer = require("inquirer");

let hatch = function() {};

hatch.prototype.getUser = function() {
  const requireLetterAndNumber = value => {
    if (/\w/.test(value) && /\d/.test(value)) {
      return true;
    }
    return "Password need to have at least a letter and a number";
  };

  inquirer
    .prompt([
      {
        type: "password",
        message: "Enter a password",
        name: "password1",
        validate: requireLetterAndNumber
      },
      {
        type: "password",
        message: "Enter a masked password",
        name: "password2",
        mask: "*",
        validate: requireLetterAndNumber
      }
    ])
    .then(answers => console.log(JSON.stringify(answers, null, "  ")));
};

hatch.prototype.getDisk = function() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "theme",
        message: "What do you want to do?",
        choices: [
          "Order a pizza",
          "Make a reservation",
          new inquirer.Separator(),
          "Ask for opening hours",
          {
            name: "Contact support",
            disabled: "Unavailable at this time"
          },
          "Talk to the receptionist"
        ]
      },
      {
        type: "list",
        name: "size",
        message: "What size do you need?",
        choices: ["Jumbo", "Large", "Standard", "Medium", "Small", "Micro"],
        filter: function(val) {
          return val.toLowerCase();
        }
      }
    ])
    .then(function(answers) {
      console.log(JSON.stringify(answers, null, "  "));
    });
};

export default new hatch();
