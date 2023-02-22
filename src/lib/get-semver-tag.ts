import type { Giterator } from 'giterator';
import { isSemver } from './get-changelog';

export function getSemverTag(commit: Giterator.Commit): string | undefined {
  return `${commit.refNames}`
    .split(',')
    .filter((str) => str.includes('tag: '))
    .map((str) => str.replace('tag: ', ''))
    .filter(isSemver)[0];
}
