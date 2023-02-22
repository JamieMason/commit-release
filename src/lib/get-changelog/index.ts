import type { Giterator } from 'giterator';
import { giterator } from 'giterator';
import type { ConventionalCommit } from '../conventional-commit';
import { getConventionalCommit } from '../conventional-commit';
import { getSemverTag } from '../get-semver-tag';
import { DefaultTemplate } from './templates/default';

export async function getChangelog(
  directory: string,
  org: string,
  repo: string,
) {
  const template = new DefaultTemplate(org, repo);

  let release: ConventionalCommit | null = null;
  let firstCommit: ConventionalCommit | null = null;
  const feat: ConventionalCommit[] = [];
  const fix: ConventionalCommit[] = [];
  const perf: ConventionalCommit[] = [];

  const lines: string[] = [];

  for await (const baseCommit of giterator(directory, {
    pageSize: 20,
    skipMerges: true,
  })) {
    const commit = getConventionalCommit(baseCommit);
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

  function flush(commit: ConventionalCommit, release: ConventionalCommit) {
    const priorRelease = commit;
    template.release({ feat, fix, perf, priorRelease, release });
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
