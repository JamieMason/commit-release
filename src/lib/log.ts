import chalk from 'chalk';

const isVerbose = process.env.NODE_ENV === 'development';

const bug = (value: string, err: Error): void =>
  console.error(
    chalk.red('! %s\n\n! Please raise an issue at %s\n\n%s'),
    value,
    chalk.underline('https://github.com/JamieMason/commit-release/issues'),
    String(err.stack).replace(/^/gm, '    '),
  );
const error = (value: string): void => console.error(chalk.red('! %s'), value);
const info = (value: string): void => console.info(chalk.blue('i %s'), value);
const success = (value: string): void =>
  console.info(chalk.green('✓ %s'), value);
const verbose = isVerbose
  ? (value: string): void => console.info(chalk.grey('? %s'), value)
  : (): void => undefined;

export const log = {
  bug,
  error,
  info,
  success,
  verbose,
};
