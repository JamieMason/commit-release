import { exec as execCb } from 'child_process';
import { getVersion } from 'conventional-recommended-version';
import { ensureFile, readJSONSync, writeFile } from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { format } from 'prettier';
import { promisify } from 'util';
import { getChangelog } from './lib/get-changelog';
import { log } from './lib/log';

const execa = promisify(execCb);

export interface Options {
  directory: string;
  force?: boolean;
  postfix?: string;
  skipHooks?: boolean;
  tagRelease?: boolean;
  version?: string;
}

export const commitRelease = async ({
  directory,
  force = false,
  postfix = '',
  skipHooks = false,
  tagRelease = true,
  version = '',
}: Options) => {
  const changelogPath = resolvePath(directory, 'CHANGELOG.md');
  const manifestPath = resolvePath(directory, 'package.json');
  const manifest = readJSONSync(manifestPath, { throws: false }) || {};
  const semver =
    version ||
    (await getVersion(directory).then(
      ({ major, minor, patch }) => `${major}.${minor}.${patch}`,
    ));
  const nextVersion = postfix ? [semver, postfix].join('-') : semver;
  const thisTagExists = await tagExists();

  if (`${manifest.repository}`.search(/[^a-z0-9.-_]/i) !== -1) {
    log.error('repository field is not a string in format "org/repo"');
    process.exit(1);
  }

  const [org, repo] = manifest.repository.split('/');

  if (nextVersion === manifest.version) {
    log.error(`the current version is already ${nextVersion}`);
    process.exit(1);
  }

  if (tagRelease && !force && thisTagExists) {
    log.error(`the tag ${nextVersion} already exists`);
    process.exit(1);
  }

  await bumpVersion();
  log.info(`version: ${nextVersion}`);

  await generateChangelog();
  log.info(`changelog: ${changelogPath}`);

  await stageChanges();
  await commitChanges();
  log.info(`release committed`);

  if (tagRelease) {
    await tagCommit();
    log.info(`release tagged`);
  }

  log.success('complete');

  async function generateChangelog() {
    const contents = await getChangelog(directory, org, repo);
    const pretty = format(contents, { proseWrap: 'never', parser: 'markdown' });
    await ensureFile(changelogPath);
    await writeFile(changelogPath, pretty);
  }

  async function tagCommit() {
    return run('git', ['tag', nextVersion, ...(force ? ['--force'] : [])]);
  }

  async function stageChanges() {
    return run('git', ['add', directory, '-A']);
  }

  async function commitChanges() {
    return run('git', [
      'commit',
      '-m',
      `"chore(release): ${nextVersion}"`,
      ...(skipHooks ? ['--no-verify'] : []),
    ]);
  }

  async function tagExists() {
    return run('git', ['tag', '--list', nextVersion]);
  }

  async function bumpVersion() {
    manifest.version = nextVersion;
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }

  async function run(bin: string, args: string[]): Promise<string> {
    const { stdout } = await execa([bin, ...args].join(' '), {
      cwd: directory,
    });
    return stdout;
  }
};
