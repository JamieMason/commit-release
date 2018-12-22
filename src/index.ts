import execa = require('execa');
import { ensureFile, readJSONSync, writeFile } from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { log } from './lib/log';

export const commitRelease = async ({
  directory,
  force = false,
  postfix = '',
  skipHooks = false,
  tagRelease = true,
  version = ''
}: {
  directory: string;
  force?: boolean;
  postfix?: string;
  skipHooks?: boolean;
  tagRelease?: boolean;
  version?: string;
}) => {
  const bumpVersion = async () => {
    const args = ['version', nextVersion, '--no-git-tag-version', '--force'];
    const { stdout } = await execa('npm', args, { cwd: directory });
    return stdout;
  };

  const tagExists = async () => {
    const args = ['tag', '--list', nextVersion];
    const { stdout } = await execa('git', args, { cwd: directory });
    return stdout === nextVersion;
  };

  const commitChanges = async () => {
    const baseArgs = ['commit', '-m', `chore(release): ${nextVersion}`];
    const args = skipHooks ? baseArgs.concat('--no-verify') : baseArgs;
    const { stdout } = await execa('git', args, { cwd: directory });
    return stdout;
  };

  const getNextVersion = async () => {
    const args = ['--directory', directory, '--postfix', postfix];
    const { stdout } = await execa(BIN_CRV, args, { cwd: directory });
    return stdout;
  };

  const stageChanges = async () => {
    const args = ['add', directory, '-A'];
    const { stdout } = await execa('git', args, { cwd: directory });
    return stdout;
  };

  const tagCommit = async () => {
    const baseArgs = ['tag', nextVersion];
    const args = force ? baseArgs.concat('--force') : baseArgs;
    const { stdout } = await execa('git', args, { cwd: directory });
    return stdout;
  };

  const generateChangelog = async () => {
    const baseArgs = ['--preset', 'angular', '--release-count', '0', '--pkg', manifestPath];
    const args = baseArgs.concat('--infile', changelogPath, '--outfile', changelogPath);
    await ensureFile(changelogPath);
    const { stdout } = await execa(BIN_CHANGELOG, args, { cwd: directory });
    return stdout;
  };

  const generateDependencyReport = async () => {
    const args = ['--no-footer', manifestPath];
    const { stdout } = await execa(BIN_MANIFEST_TO_README, args, { cwd: directory });
    await ensureFile(dependencyLogPath);
    await writeFile(dependencyLogPath, stdout, { encoding: 'utf8' });
    return stdout;
  };

  const formatMarkdown = async () => {
    const baseArgs = ['--parser', 'markdown', '--prose-wrap', 'always', '--print-width', '80'];
    const args = baseArgs.concat('--write', changelogPath, dependencyLogPath);
    const { stdout } = await execa(BIN_PRETTIER, args, { cwd: directory });
    return stdout;
  };

  const { stdout: binPath } = await execa('npm', ['bin'], { cwd: __dirname });
  const BIN_CHANGELOG = resolvePath(binPath, 'conventional-changelog');
  const BIN_CRV = resolvePath(binPath, 'conventional-recommended-version');
  const BIN_MANIFEST_TO_README = resolvePath(binPath, 'readme');
  const BIN_PRETTIER = resolvePath(binPath, 'prettier');
  const changelogPath = resolvePath(directory, 'CHANGELOG.md');
  const dependencyLogPath = resolvePath(directory, 'DEPENDENCIES.md');
  const manifestPath = resolvePath(directory, 'package.json');
  const manifest = readJSONSync(manifestPath, { throws: false }) || {};
  const nextVersion = version || (await getNextVersion());
  const thisTagExists = await tagExists();

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

  await generateDependencyReport();
  log.info(`dependency report: ${dependencyLogPath}`);

  await formatMarkdown();

  await stageChanges();
  await commitChanges();
  log.info(`release committed`);

  if (tagRelease) {
    await tagCommit();
    log.info(`release tagged`);
  }

  log.success('complete');
};
