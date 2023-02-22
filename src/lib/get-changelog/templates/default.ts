import type { Commit } from '../get-commits';

export class DefaultTemplate {
  org: string;
  repo: string;

  constructor(org: string, repo: string) {
    this.org = org;
    this.repo = repo;
  }

  release({
    feat,
    fix,
    perf,
    priorRelease,
    release,
  }: {
    feat: Commit[];
    fix: Commit[];
    perf: Commit[];
    release: Commit;
    priorRelease: Commit;
  }): string {
    const lines: string[] = [];
    lines.push(this.releaseHeader(release, priorRelease));
    lines.push('');
    if (feat.length) {
      lines.push('### Features');
      lines.push('');
      feat.forEach((c) => lines.push(this.feature(c)));
      lines.push('');
      feat.length = 0;
    }
    if (fix.length) {
      lines.push('### Bug Fixes');
      lines.push('');
      fix.forEach((c) => lines.push(this.bugFix(c)));
      lines.push('');
      fix.length = 0;
    }
    if (perf.length) {
      lines.push('### Performance Improvements');
      lines.push('');
      perf.forEach((c) => lines.push(this.perfImprovement(c)));
      lines.push('');
      perf.length = 0;
    }
    return lines.join('\n');
  }

  releaseHeader(release: Commit, priorRelease: Commit): string {
    const priorVersion = priorRelease.version;
    const version = release.version;
    const compareUrl = this.repoUrl(`/compare/${priorVersion}...${version}`);
    const date = release.committerDate?.replace(/T.+$/, '') || '';
    return priorVersion
      ? `## [${version}](${compareUrl}) (${date})`
      : `## ${version} (${date})`;
  }

  feature(commit: Commit) {
    return this.writeCommit('🎁 ', commit);
  }

  bugFix(commit: Commit) {
    return this.writeCommit('🪲 ', commit);
  }

  perfImprovement(commit: Commit) {
    return this.writeCommit('🚀 ', commit);
  }

  writeCommit(icon: string, commit: Commit): string {
    const { breakingChanges, commitHash, scope, message, shortHash } = commit;
    const commitUrl = this.repoUrl(`/commit/${commitHash}`);
    const closes = this.getIssueUrls(commit.closes);
    const refs = this.getIssueUrls(commit.refs);
    const linked = [
      closes.length ? `(closes: ${closes.join(', ')})` : '',
      refs.length ? `(refs: ${refs.join(', ')})` : '',
    ]
      .filter(Boolean)
      .join(' ');
    const body = breakingChanges ? `\n\n${breakingChanges}` : '';
    return `* ${icon}**${scope}:** ${message} ([${shortHash}](${commitUrl})) ${linked}${body}`;
  }

  getIssueUrls(issueNumbers: string[]): string[] {
    return issueNumbers.map((issueNumber) => {
      const url = this.repoUrl(`/issues/${issueNumber}`);
      return `[#${issueNumber}](${url})`;
    });
  }

  repoUrl(pathname = ''): string {
    return `https://github.com/${this.org}/${this.repo}${pathname}`;
  }
}
