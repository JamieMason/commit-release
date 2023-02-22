import type { Giterator } from 'giterator';
import { getSemverTag } from './get-semver-tag';

type Options = {
  org: string;
  repo: string;
};

export const write = {
  releaseHeader(
    { org, repo }: Options,
    release: Giterator.Commit,
    priorRelease: Giterator.Commit,
  ): string {
    const version = getSemverTag(release);
    const priorVersion = getSemverTag(priorRelease);
    const compareUrl = `https://github.com/${org}/${repo}/compare`;
    const date = release.committerDate?.replace(/T.+$/, '');
    return priorVersion
      ? `## [${version}](${compareUrl}/${priorVersion}...${version}) (${date})`
      : `## ${version} (${date})`;
  },
  feature: writeCommit.bind(null, 'feat'),
  bugFix: writeCommit.bind(null, 'fix'),
  perfImprovement: writeCommit.bind(null, 'perf'),
};

function writeCommit(
  type: 'feat' | 'fix' | 'perf',
  options: Options,
  commit: Giterator.Commit,
): string {
  const { org, repo } = options;
  const scope = commit.subject?.replace(`${type}(`, '').split('): ')[0] || '';
  const message = commit.subject?.split('): ')[1] || '';
  const hash = commit.commitHash;
  const shortHash = hash?.slice(0, 7);
  const commitUrl = `https://github.com/${org}/${repo}/commit/${hash}`;
  const closesIssues = getRefs('closes', options, commit);
  const refsIssues = getRefs('refs', options, commit);
  const linked = [
    closesIssues.length ? `(closes: ${closesIssues.join(', ')})` : '',
    refsIssues.length ? `(refs: ${refsIssues.join(', ')})` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const breaking = getBreakingChanges(commit);
  const body = breaking ? `\n\n${breaking}` : '';
  return `* **${scope}:** ${message} ([${shortHash}](${commitUrl})) ${linked}${body}`;
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

function getRefs(
  type: 'closes' | 'refs',
  { org, repo }: Options,
  commit: Giterator.Commit,
): string[] {
  return `${commit.body}`
    .split('\n')
    .filter((line) => line.toLowerCase().startsWith(type))
    .flatMap((line) => line.match(/#[0-9]+/) || '')
    .filter(Boolean)
    .map((issue) => {
      const issueNumber = issue.replace('#', '');
      const url = `https://github.com/${org}/${repo}/issues/${issueNumber}`;
      return `[${issue}](${url})`;
    });
}
