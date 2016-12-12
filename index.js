#!/usr/bin/env node

// 3rd party modules
var chalk = require('chalk');
var program = require('commander');

// modules
var commitRelease = require('./src/commit-release');

// implementation
program
  .option('-f, --force', 'overwrite tag if it exists already')
  .option('-n, --no-verify', 'skip git commit hooks')
  .option('-o, --override [version]', 'override recommended version number', '')
  .option('-p, --postfix [name]', 'a postfix such as "rc1", "canary" or "beta1"', '')
  .parse(process.argv);

commitRelease({
  directory: process.cwd(),
  force: program.force,
  noVerify: !program.verify,
  overrideVersion: program.override,
  postfix: program.postfix
}, onComplete);

function onComplete(err, options) {
  if (err) {
    console.error(chalk.red(err.stack ? err.stack : err));
    process.exit(1);
  }
  console.log(chalk.green('Release ' + options.version + ' committed and tagged, changelog updated.'));
}
