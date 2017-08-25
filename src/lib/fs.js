import fs from 'graceful-fs';
import whenNode from 'when/node';

export const createWriteStream = fs.createWriteStream;
export const writeFile = whenNode.lift(fs.writeFile);
export const unlink = whenNode.lift(fs.unlink);
