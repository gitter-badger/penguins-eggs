#!/usr/bin/env node

"use strict";
//import { install } from "source-map-support";
//install();

let program = require("commander");
let cmdValue="";
let envValue="";

program.version("0.1.0").arguments("<cmd> [env]");

program
  .command("create")
  .alias("c")
  .description("create egg and netboot")
  .action(function(cmd, env) {
    cmdValue = cmd;
    envValue = env;
  });

program
  .command("rebuild")
  .alias("r")
  .description("rebuild egg and netboot")
  .action(function(cmd) {
    console.log(cmd);
  });

program
  .command("install")
  .alias("i")
  .description("install netboot services")
  .action(function(cmd) {
    console.log(cmd);
  });

program
  .command("purge")
  .alias("p")
  .description("remove and purge netboot services")
  .action(function(cmd) {
    console.log(cmd);
  });

program
  .command("start")
  .alias("s")
  .description("start netboot services")
  .action(function(cmd) {
    console.log(cmd);
  });

program
  .command("stop")
  .alias("o")
  .description("stop netboot services")
  .action(function(cmd) {
    console.log(cmd);
  });

program
  .command("restart")
  .alias("r")
  .description("restart netboot services")
  .action(function(cmd) {
    console.log(cmd);
  });

program.parse(process.argv);

if (typeof cmdValue === "undefined") {
  console.error("no command given!");
  process.exit(1);
}
console.log("command:", cmdValue);
console.log("environment:", envValue || "no environment given");
