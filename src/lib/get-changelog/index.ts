import type { Giterator } from 'giterator';
import { getSemverTag } from '../get-semver-tag';
import type { Commit } from './get-commits';
import { getCommits } from './get-commits';
import { DefaultTemplate } from './templates/default';

export async function getChangelog(
  directory: string,
  org: string,
  repo: string,
) {
  const template = new DefaultTemplate(org, repo);

  let release: Commit | null = null;
  let firstCommit: Commit | null = null;
  const feat: Commit[] = [];
  const fix: Commit[] = [];
  const perf: Commit[] = [];

  const lines: string[] = [];

  for await (const commit of getCommits(directory)) {
    const semver = getSemverTag(commit);
    // collect commits from the previous release
    if (release) {
      if (isFeature(commit)) feat.push(commit);
      if (isFix(commit)) fix.push(commit);
      if (isPerf(commit)) perf.push(commit);
      // this commit is a release, flush previous release
      if (semver) {
        flush(commit, release);
      }
    }
    if (semver) {
      // start collecting next release
      release = commit;
    }
    firstCommit = commit;
  }

  if (feat.length + fix.length + perf.length > 0 && firstCommit && release) {
    flush(firstCommit, release);
  }

  return lines.join('\n');

  function flush(commit: Commit, release: Commit) {
    const priorRelease = commit;
    lines.push(template.release({ feat, fix, perf, priorRelease, release }));
  }
}

function isFeature({ subject = '' }: Giterator.Commit): boolean {
  return subject.startsWith('feat(');
}

function isFix({ subject = '' }: Giterator.Commit): boolean {
  return subject.startsWith('fix(');
}

function isPerf({ subject = '' }: Giterator.Commit): boolean {
  return subject.startsWith('perf(');
}
