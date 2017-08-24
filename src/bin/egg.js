#!/usr/bin/env node

"use strict";
import { install } from "source-map-support";
install();


let program = require("commander")
.version('0.1.0');

program
.command('create','create egg and netboot if installed')
.usage('eggs create --distroname littlebird --username scott --password tiger')
.option('-d --distroname [distroname]', 'The user will be created')
.option('-u --username [username]', 'The user will be created')
.option('-p --password [password]', 'The password for user');

program
  .command('rebuild','rebuild egg')
  .option('-D --distroname [distroname]', 'The user will be created');

program
.command('netboot [action]','netboot')
.option('purge','purge netboot')
.option('install', 'install netboot')
.option('purge', 'purge netboot')
.option('start', 'start netboot')
.option('stop', 'stop netboot')
.option('restart', 'restart netboot');

program
.parse(process.argv);

let command=process.argv[2];
console.log(`command: ${command}`);

if (command=='create'){
  console.log(`distroName: ${program.distroname}`);
  console.log(`username: ${program.username}`);
  console.log(`password: ${program.password}`);
} else if(command=='netboot') {
  if(program.install){
    console.log("Action install netboot");
  }
  if(program.purge){
    console.log("Action purge netboot");
  }
  if(program.start){
    console.log("Action start netboot");
  }
  if(program.stop){
    console.log("Action stop netboot");
  }
  if(program.restart){
    console.log("Action restart netboot");
  }
} else if(command=='rebuild') {
  console.log("Action rebuild egg and netboot");
}
  else{
  console.log("Usage: egg [create|rebuild|netboot]");
}


process.exit(0);
