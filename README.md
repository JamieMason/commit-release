# commit-release

Commit and tag a release for a conventional changelog project.

## Install

```shell
npm i -g commit-release
```

## Usage

```shell
$ commit-release --help

  Usage: index [options]

  Options:

    -h, --help                output usage information
    -b, --bump                use "conventional-recommended-bump"
    -f, --force               overwrite tag if it exists already
    -n, --no-verify           skip git commit hooks
    -o, --override [version]  override recommended version number
    -p, --postfix [name]      a postfix such as "rc1", "canary" or "beta1"
    -t, --no-tag              does not automatically tag the commit
    -v, --verbose             let the shell commands be more talkative
```
