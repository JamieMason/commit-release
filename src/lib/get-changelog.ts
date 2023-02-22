import type { Giterator } from 'giterator';
import { giterator } from 'giterator';
import type { ConventionalCommit } from './conventional-commit';
import { getConventionalCommit } from './conventional-commit';
import { getSemverTag } from './get-semver-tag';
import { write } from './write';

export async function getChangelog(
  directory: string,
  org: string,
  repo: string,
) {
  const options = { org, repo };

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
    lines.push(write.releaseHeader(options, release, priorRelease));
    lines.push('');
    if (feat.length) {
      lines.push('### Features');
      lines.push('');
      feat.forEach((c) => lines.push(write.feature(options, c)));
      lines.push('');
      feat.length = 0;
    }
    if (fix.length) {
      lines.push('### Bug Fixes');
      lines.push('');
      fix.forEach((c) => lines.push(write.bugFix(options, c)));
      lines.push('');
      fix.length = 0;
    }
    if (perf.length) {
      lines.push('### Performance Improvements');
      lines.push('');
      perf.forEach((c) => lines.push(write.perfImprovement(options, c)));
      lines.push('');
      perf.length = 0;
    }
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

export function isSemver(version: unknown): version is string {
  const ints = '[0-9]+';
  const dot = '\\.';
  const semver = new RegExp(`^${ints}${dot}${ints}${dot}${ints}`);
  return typeof version === 'string' && version.search(semver) !== -1;
}
