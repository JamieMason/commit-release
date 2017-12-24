import crv from 'conventional-recommended-version';
import { resolve as resolvePath } from 'path';
import { exec, spawn } from './lib/child-process';
import { createWriteStream, unlink, writeFile } from './lib/fs';
import { bug as logBug, error as logError, info as logInfo, success as logSuccess } from './lib/log';
import { IOptions } from './typings';

const changelog = require('conventional-changelog');

const bumpVersion = (directory: string, nextVersion: string) =>
  exec(`npm version ${nextVersion} --no-git-tag-version --force`, { cwd: directory }).catch((err: Error) => {
    logBug(`failed to run "npm version" with version "${nextVersion}"`, err);
    process.exit(1);
  });

const tagExists = (tagName: string): Promise<boolean> =>
  exec(`git tag --list ${tagName}`).then(({ stdout }) => stdout === tagName);

const abortOnExistingTag = (force: boolean, nextVersion: string, tagRelease: boolean) =>
  Promise.resolve().then(async () => {
    if (tagRelease && !force && (await tagExists(nextVersion))) {
      logError(`the tag ${nextVersion} already exists`);
      process.exit(1);
    }
  });

const abortOnUnchangedVersion = (manifestPath: string, nextVersion: string) =>
  Promise.resolve().then(() => {
    const { version: currentVersion } = require(manifestPath);
    if (nextVersion === currentVersion) {
      logError(`the current version is already ${nextVersion}`);
      process.exit(1);
    }
  });

const commitChanges = (directory: string, nextVersion: string, skipHooks: boolean) => {
  const baseArgs = ['commit', '-m', `chore(release): ${nextVersion}`];
  const args = skipHooks ? baseArgs.concat('--no-verify') : baseArgs;
  return spawn('git', args, { cwd: directory });
};

const getVersion = (directory: string, postfix: string): Promise<string> =>
  new Promise((resolve, reject) =>
    crv(
      { directory, postfix },
      (err: Error | null, version: string | undefined) => (err ? reject(err) : resolve(version))
    )
  );

const stageChanges = (directory: string) =>
  exec('git add . -A', { cwd: directory }).catch((err: Error) => {
    logBug('failed to stage changes for release commit', err);
    process.exit(1);
  });

const tagCommit = (directory: string, force: boolean, nextVersion: string) =>
  exec(`git tag ${nextVersion}${force ? ' --force' : ''}`, { cwd: directory });

const generateChangelog = (changelogPath: string, directory: string) =>
  unlink(changelogPath)
    .then(
      () =>
        new Promise((resolve, reject) => {
          const fileWrite$ = createWriteStream(changelogPath);
          fileWrite$.on('finish', (err: Error) => (err ? reject(err) : resolve()));
          changelog({ path: directory, preset: 'angular', releaseCount: 0 }).pipe(fileWrite$);
        })
    )
    .catch((err: Error) => {
      logBug('failed to generate changelog', err);
      process.exit(1);
    });

const generateDependencyReport = (dependencyLogPath: string, manifestPath: string) =>
  spawn('node', [require.resolve('package-json-to-readme'), '--no-footer', manifestPath])
    .then((stdout) => writeFile(dependencyLogPath, stdout, { encoding: 'utf8' }))
    .catch((err: Error) => {
      logBug('failed to generate dependency report', err);
      process.exit(1);
    });

export default async ({
  directory,
  force = false,
  postfix = '',
  skipHooks = false,
  tagRelease = true,
  version = ''
}: IOptions) => {
  const nextVersion = version || (await getVersion(directory, postfix));
  const changelogPath = resolvePath(directory, 'CHANGELOG.md');
  const dependencyLogPath = resolvePath(directory, 'DEPENDENCIES.md');
  const manifestPath = resolvePath(directory, 'package.json');

  await abortOnUnchangedVersion(manifestPath, nextVersion);
  await abortOnExistingTag(force, nextVersion, tagRelease);

  await bumpVersion(directory, nextVersion);
  logInfo(`version: ${nextVersion}`);

  await generateChangelog(changelogPath, directory);
  logInfo(`changelog: ${changelogPath}`);

  await generateDependencyReport(dependencyLogPath, manifestPath);
  logInfo(`dependency report: ${dependencyLogPath}`);

  await stageChanges(directory);
  await commitChanges(directory, nextVersion, skipHooks);
  logInfo(`release committed`);

  if (tagRelease) {
    await tagCommit(directory, force, nextVersion);
    logInfo(`release tagged`);
  }

  logSuccess('complete');
};
