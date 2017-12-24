import { shell, stdout } from 'execa';

export const exec = shell;
export const spawn = stdout;
