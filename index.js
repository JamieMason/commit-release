#!/usr/bin/env node

// 3rd party modules
var chalk = require('chalk');
var program = require('commander');

// modules
var commitRelease = require('./src/commitRelease');

// implementation
program
    .option('-p, --postfix [name]', 'a postfix such as "rc1", "canary" or "beta1"', '')
    .parse(process.argv);

commitRelease.create({
    directory: process.cwd(),
    postfix: program.postfix
}, onComplete);

function onComplete(err, version) {
    if (err) {
        console.error(err.stack);
        process.exit(1);
    }
    console.log(chalk.green('Release ' + version + ' committed and tagged, changelog updated.'));
}
