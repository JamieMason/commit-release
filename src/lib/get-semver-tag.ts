import type { Giterator } from 'giterator';

export function getSemverTag(commit: Giterator.Commit): string | undefined {
  return `${commit.refNames}`
    .split(',')
    .filter((str) => str.includes('tag: '))
    .map((str) => str.replace('tag: ', ''))
    .filter(isSemver)[0];
}

function isSemver(version: unknown): version is string {
  const ints = '[0-9]+';
  const dot = '\\.';
  const semver = new RegExp(`^${ints}${dot}${ints}${dot}${ints}`);
  return typeof version === 'string' && version.search(semver) !== -1;
}
