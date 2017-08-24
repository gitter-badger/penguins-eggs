#!/usr/bin/env node

"use strict";
import { install } from "source-map-support";
install();

let program = require("commander")
.version("0.3.5");

program
.command('create','create egg and netboot if installed')
.usage('eggs create --distroname littlebird --username scott --password tiger')
.option('-d --distroname [distroname]', 'The name of distro')
.option('-u --username [username]', 'The user of the distro')
.option('-p --password [password]', 'The password for user');

program
.command('rebuild','rebuild egg and netboot stuffs');

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
if (command=='create'){                               //CREATE
  console.log("Action create egg and netboot");
} else if(command=='netboot') {                       //NETBOOT
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
} else if(command=='rebuild') {                   //REBUILD
  console.log("Action rebuild egg and netboot");
}
  else{
  console.log("Usage: eggs [create|rebuild|netboot [start|stop|restart|install|purge]]");
  process.exit(1);
}

console.log(`distroName: ${program.distroname}`);
console.log(`username: ${program.username}`);
console.log(`password: ${program.password}`);

process.exit(0);
