# commit-release

[![NPM version](http://img.shields.io/npm/v/commit-release.svg?style=flat-square)](https://www.npmjs.com/package/commit-release)
[![NPM downloads](http://img.shields.io/npm/dm/commit-release.svg?style=flat-square)](https://www.npmjs.com/package/commit-release)
[![Dependency Status](http://img.shields.io/david/JamieMason/commit-release.svg?style=flat-square)](https://david-dm.org/JamieMason/commit-release)
[![Gitter Chat for commit-release](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/JamieMason/commit-release)
[![Donate via PayPal](https://img.shields.io/badge/donate-paypal-blue.svg)](https://www.paypal.me/foldleft)
[![Donate via Gratipay](https://img.shields.io/gratipay/user/JamieMason.svg)](https://gratipay.com/~JamieMason/)
[![Analytics](https://ga-beacon.appspot.com/UA-45466560-5/commit-release?flat&useReferer)](https://github.com/igrigorik/ga-beacon)
[![Follow JamieMason on GitHub](https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow)](https://github.com/JamieMason)
[![Follow fold_left on Twitter](https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow)](https://twitter.com/fold_left)

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
    -f, --force               overwrite tag if it exists already
    -n, --no-verify           skip git commit hooks
    -o, --override [version]  override recommended version number
    -p, --postfix [name]      a postfix such as "rc1", "canary" or "beta1"
    -t, --no-tag'             skip tagging the commit
```
