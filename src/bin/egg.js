#!/usr/bin/env node
var argv = require("yargs")
    .usage('Usage: $0 <commands> [options]')
    .option('netboot', {
        alias: 'n',
        describe: 'choose the action',
        choices: ['start', 'stop', 'restart', 'install', 'purge']
      })
      .command('create', 'create eggs and incubator')
      .example('$0 create', 'create eggs and incubator')
      .alias('c','create')
      .describe('c', 'create eggs and incubator')
      .command('rebuild', 'destroy and create eggs and incubator')
      .example('$0 rebuild', 'destroy and create eggs and incubator')
      .alias('r','rebuild')
      .describe('c', 'rebuild eggs and incubator')

    .help('h')
    .alias('h','help')
    .epilog('(C) 2017 piero.proietti@gmail.com<<<')
    .argv;

console.log(argv._);

let version = "We are just testing...";
welcome();


function welcome() {
  console.log(`>>> Eggs ${version} <<<`);
}

function help() {
  console.log(`Eggs version: ${version}`);
  console.log(
    `Description: an utility to remaster your system and boot it from remote`
  );
  console.log(`Usage: eggs [options]`);
  console.log(`>>>  help        this help`);
  console.log(`>>>  rebuild     destroy and rebuild all`);
  console.log(`>>>  install     install incubator netboot`);
  console.log(`>>>  purge       purge incubator netboot`);
  console.log(`>>>  start       start bootserver services`);
  console.log(`>>>  stop        stop bootserver services`);
  console.log(`>>>  restart     restart bootserver services`);

  console.log(`Eggs work with Debian 8 jessie and Debian 9 strecth`);
  console.log(`>>>(C) 2017 piero.proietti@gmail.com<<<`);
}
