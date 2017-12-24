import { createWriteStream as fsCreateWriteStream, unlink as fsUnlink, writeFile as fsWriteFile } from 'graceful-fs';

export const createWriteStream = fsCreateWriteStream;

export const unlink = (path: string): Promise<void> =>
  new Promise((resolve, reject) => {
    fsUnlink(path, (err: Error | null) => {
      if (err && err.message.indexOf('ENOENT') === -1) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export const writeFile = (path: string, contents: string, options?: object): Promise<void> =>
  new Promise((resolve, reject) => {
    fsWriteFile(path, contents, options, (err: Error | null) => (err ? reject(err) : resolve()));
  });
