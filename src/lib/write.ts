import type { ConventionalCommit } from './conventional-commit';

type Options = {
  org: string;
  repo: string;
};

export const write = {
  releaseHeader(
    { org, repo }: Options,
    release: ConventionalCommit,
    priorRelease: ConventionalCommit,
  ): string {
    const compareUrl = `https://github.com/${org}/${repo}/compare`;
    const date = release.committerDate?.replace(/T.+$/, '');
    return priorRelease.version
      ? `## [${release.version}](${compareUrl}/${priorRelease.version}...${release.version}) (${date})`
      : `## ${release.version} (${date})`;
  },
  feature: writeCommit.bind(null, 'feat'),
  bugFix: writeCommit.bind(null, 'fix'),
  perfImprovement: writeCommit.bind(null, 'perf'),
};

function writeCommit(
  type: 'feat' | 'fix' | 'perf',
  options: Options,
  commit: ConventionalCommit,
): string {
  const { org, repo } = options;
  const { breakingChanges, commitHash, scope, message, shortHash } = commit;
  const commitUrl = `https://github.com/${org}/${repo}/commit/${commitHash}`;
  const closes = getIssueUrls(options, commit.closes);
  const refs = getIssueUrls(options, commit.refs);
  const linked = [
    closes.length ? `(closes: ${closes.join(', ')})` : '',
    refs.length ? `(refs: ${refs.join(', ')})` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const body = breakingChanges ? `\n\n${breakingChanges}` : '';
  return `* **${scope}:** ${message} ([${shortHash}](${commitUrl})) ${linked}${body}`;
}

function getIssueUrls(
  { org, repo }: Options,
  issueNumbers: string[],
): string[] {
  return issueNumbers.map((issueNumber) => {
    const url = `https://github.com/${org}/${repo}/issues/${issueNumber}`;
    return `[#${issueNumber}](${url})`;
  });
}
