import path from 'path';
import changelog from 'conventional-changelog';
import crv from 'conventional-recommended-version';
import when from 'when';
import * as childProcess from './lib/child-process';
import * as fs from './lib/fs';
import * as log from './lib/log';

const bumpVersion = ({ directory, nextVersion }) =>
  childProcess
    .exec(`npm version ${nextVersion} --no-git-tag-version --force`, { cwd: directory })
    .catch(err => {
      log.bug(`failed to run "npm version" with version "${nextVersion}"`, err);
      process.exit(1);
    });

const tagExists = tagName =>
  childProcess.exec(`git tag --list ${tagName}`).then(({ stdout }) => stdout === tagName);

const abortOnExistingTag = ({ force, nextVersion, tagRelease }) =>
  when.resolve().then(async () => {
    if (tagRelease && !force && (await tagExists(nextVersion))) {
      log.error(`the tag ${nextVersion} already exists`);
      process.exit(1);
    }
  });

const abortOnUnchangedVersion = ({ manifestPath, nextVersion }) =>
  when.resolve().then(() => {
    const { version: currentVersion } = require(manifestPath);
    if (nextVersion === currentVersion) {
      log.error(`the current version is already ${nextVersion}`);
      process.exit(1);
    }
  });

const commitChanges = ({ directory, nextVersion, skipHooks }) => {
  const baseArgs = ['commit', '-m', `chore(release): ${nextVersion}`];
  const args = skipHooks ? baseArgs.concat('--no-verify') : baseArgs;
  return childProcess.spawn('git', args, { cwd: directory });
};

const getVersion = ({ directory, postfix }) =>
  when.promise((resolve, reject) =>
    crv.get({ directory, postfix }, (err, version) => (err ? reject(err) : resolve(version)))
  );

const stageChanges = directory =>
  childProcess.exec('git add . -A', { cwd: directory }).catch(err => {
    log.bug('failed to stage changes for release commit', err);
    process.exit(1);
  });

const tagCommit = ({ directory, force, nextVersion }) =>
  childProcess.exec(`git tag ${nextVersion}${force ? ' --force' : ''}`, { cwd: directory });

const generateChangelog = ({ changelogPath, directory }) =>
  fs
    .unlink(changelogPath)
    .then(() =>
      when.promise((resolve, reject) => {
        const fileWrite$ = fs.createWriteStream(changelogPath);
        fileWrite$.on('finish', err => (err ? reject(err) : resolve()));
        changelog({ path: directory, preset: 'angular', releaseCount: 0 }).pipe(fileWrite$);
      })
    )
    .catch(err => {
      log.bug('failed to generate changelog', err);
      process.exit(1);
    });

const generateDependencyReport = ({ dependencyLogPath, manifestPath }) =>
  childProcess
    .spawn('node', [require.resolve('package-json-to-readme'), '--no-footer', manifestPath])
    .then(({ stdout }) => fs.writeFile(dependencyLogPath, stdout, { encoding: 'utf8' }))
    .catch(err => {
      log.bug('failed to generate dependency report', err);
      process.exit(1);
    });

export default async ({ directory, force, postfix, skipHooks, tagRelease, version }) => {
  const nextVersion = version || (await getVersion({ directory, postfix }));
  const changelogPath = path.resolve(directory, 'CHANGELOG.md');
  const dependencyLogPath = path.resolve(directory, 'DEPENDENCIES.md');
  const manifestPath = path.resolve(directory, 'package.json');

  await abortOnUnchangedVersion({ manifestPath, nextVersion });
  await abortOnExistingTag({ force, nextVersion, tagRelease });

  await bumpVersion({ directory, nextVersion });
  log.info(`version: ${nextVersion}`);

  await generateChangelog({ changelogPath, directory });
  log.info(`changelog: ${changelogPath}`);

  await generateDependencyReport({ dependencyLogPath, manifestPath });
  log.info(`dependency report: ${dependencyLogPath}`);

  await stageChanges(directory);
  await commitChanges({ directory, nextVersion, skipHooks });
  log.info(`release committed`);

  if (tagRelease) {
    await tagCommit({ directory, force, nextVersion });
    log.info(`release tagged`);
  }

  log.success('complete');
};
