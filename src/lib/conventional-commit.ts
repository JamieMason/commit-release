import type { Giterator } from 'giterator';
import { getSemverTag } from './get-semver-tag';

export type ConventionalCommit = Giterator.Commit & {
  breakingChanges: string;
  closes: string[];
  message: string;
  refs: string[];
  scope: string;
  shortHash: string;
  type: string;
  version: string;
};

export function getConventionalCommit(
  commit: Giterator.Commit,
): ConventionalCommit {
  const [type, scope, message] = `${commit.subject}`.split(/[()]:? ?/g);
  return {
    ...commit,
    breakingChanges: getBreakingChanges(commit),
    closes: getRefs('closes', commit),
    message: message || '',
    refs: getRefs('refs', commit),
    scope: scope || '',
    shortHash: commit.commitHash?.slice(0, 7) || '',
    type: type || '',
    version: getSemverTag(commit) || '',
  };
}

function getBreakingChanges(commit: Giterator.Commit): string {
  if (`${commit.body}`.search(/BREAKING CHANGE/) === -1) return '';
  return `${commit.body}`
    .trim()
    .split('\n')
    .map((line) => {
      if (line.includes('BREAKING CHANGE')) return '### Breaking Changes';
      if (line.search(/^(closes|refs)/i) !== -1) return '';
      if (line.search(/Co-authored-by/i) !== -1) return '';
      return line;
    })
    .join('\n')
    .trim();
}

function getRefs(type: 'closes' | 'refs', commit: Giterator.Commit): string[] {
  return `${commit.body}`
    .split('\n')
    .filter((line) => line.toLowerCase().startsWith(type))
    .flatMap((line) => line.match(/#[0-9]+/) || '')
    .filter(Boolean)
    .map((issue) => issue.replace('#', ''));
}
