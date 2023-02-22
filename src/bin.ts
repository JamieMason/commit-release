#!/usr/bin/env node

import { program } from 'commander';
import { commitRelease } from './index';
import { log } from './lib/log';

const { version } = require('../package.json');

program
  .version(version)
  .option('-f, --force', 'overwrite tag if it exists already')
  .option('-n, --no-verify', 'skip git commit hooks')
  .option('-o, --override [version]', 'override recommended version number', '')
  .option(
    '-p, --postfix [name]',
    'a postfix such as "rc1", "canary" or "beta1"',
    '',
  )
  .option('-t, --no-tag', 'skip tagging the commit')
  .parse(process.argv);

commitRelease({
  directory: process.cwd(),
  force: Boolean(program.opts().force),
  postfix: program.opts().postfix,
  skipHooks: Boolean(program.opts().verify),
  tagRelease: Boolean(program.opts().tag),
  version: program.opts().override,
}).catch((err) => {
  log.bug('uncaught error in commitRelease', err);
  process.exit(1);
});
