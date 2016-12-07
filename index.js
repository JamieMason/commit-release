#!/usr/bin/env node

// 3rd party modules
var chalk = require('chalk');
var program = require('commander');

// modules
var commitRelease = require('./src/commitRelease');

// implementation
program
  .option('-b, --bump', 'use "conventional-recommended-bump"')
  .option('-f, --force', 'overwrite tag if it exists already')
  .option('-n, --no-verify', 'skip git commit hooks')
  .option('-o, --override [version]', 'override recommended version number', '')
  .option('-p, --postfix [name]', 'a postfix such as "rc1", "canary" or "beta1"', '')
  .option('-t, --no-tag', 'does not automatically tag the commit')
  .option('-v, --verbose', 'let the shell commands be more talkative')
  .parse(process.argv);

commitRelease.create({
  directory: process.cwd(),
  bump: program.bump,
  force: program.force,
  noVerify: !program.verify,
  overrideVersion: program.override,
  postfix: program.postfix,
  noTag: !program.tag,
  verbose: program.verbose
}, onComplete);

function onComplete (err, options) {
  if (err) {
    console.error(chalk.red(err.stack ? err.stack : err));
    process.exit(1);
  }

  console.log(chalk.green(
    'Release ' + options.version + ' committed' +
    (!options.noTag ? ' and tagged' : '') +
    ', changelog updated.'));
}
