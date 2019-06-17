## [1.2.2](https://github.com/JamieMason/commit-release/compare/1.2.1...1.2.2) (2019-06-17)

### Bug Fixes

- **npm:** update dependencies
  ([66a579d](https://github.com/JamieMason/commit-release/commit/66a579d)),
  closes [#9](https://github.com/JamieMason/commit-release/issues/9)
  [#10](https://github.com/JamieMason/commit-release/issues/10)
  [#11](https://github.com/JamieMason/commit-release/issues/11)
  [#12](https://github.com/JamieMason/commit-release/issues/12)
  [#13](https://github.com/JamieMason/commit-release/issues/13)

## [1.2.1](https://github.com/JamieMason/commit-release/compare/1.0.0...1.2.1) (2018-12-22)

### Bug Fixes

- **core:** fix ENOENT errors for generated files
  ([b8d8fc7](https://github.com/JamieMason/commit-release/commit/b8d8fc7))

### Features

- **core:** format generated markdown with prettier
  ([636b883](https://github.com/JamieMason/commit-release/commit/636b883))
- **npm:** update dependencies
  ([3b571bb](https://github.com/JamieMason/commit-release/commit/3b571bb))

# [1.0.0](https://github.com/JamieMason/commit-release/compare/0.7.5...1.0.0) (2017-12-24)

### Bug Fixes

- **core:** catch ENOENT errors when deleting files
  ([a9db117](https://github.com/JamieMason/commit-release/commit/a9db117))
- **core:** use correct repo url in error logs
  ([a79577d](https://github.com/JamieMason/commit-release/commit/a79577d))

### Features

- **core:** change default export to named
  ([50d233e](https://github.com/JamieMason/commit-release/commit/50d233e))
- **core:** migrate to typescript
  ([8209c41](https://github.com/JamieMason/commit-release/commit/8209c41))

### BREAKING CHANGES

- **core:** import { commitRelease } from 'commit-release';

## [0.7.5](https://github.com/JamieMason/commit-release/compare/0.7.4...0.7.5) (2017-08-27)

### Bug Fixes

- **npm:** add missing nodent-runtime
  ([b1fc805](https://github.com/JamieMason/commit-release/commit/b1fc805))

## [0.7.4](https://github.com/JamieMason/commit-release/compare/0.6.2...0.7.4) (2017-08-26)

### Bug Fixes

- **npm:** update dependencies
  ([22e7773](https://github.com/JamieMason/commit-release/commit/22e7773))
- **shell:** use fs and child process safely
  ([21f833b](https://github.com/JamieMason/commit-release/commit/21f833b)),
  closes [#5](https://github.com/JamieMason/commit-release/issues/5)

### Features

- **options:** add --no-tag option
  ([d46aa6b](https://github.com/JamieMason/commit-release/commit/d46aa6b))

## [0.6.2](https://github.com/JamieMason/commit-release/compare/0.6.1...0.6.2) (2016-07-26)

### Bug Fixes

- **npm:** update dependencies
  ([9e41ac4](https://github.com/JamieMason/commit-release/commit/9e41ac4))

## [0.6.1](https://github.com/JamieMason/commit-release/compare/0.6.0...0.6.1) (2016-05-13)

### Bug Fixes

- **npm:** update dependencies
  ([9190f0d](https://github.com/JamieMason/commit-release/commit/9190f0d))

# [0.6.0](https://github.com/JamieMason/commit-release/compare/0.5.2...0.6.0) (2016-05-13)

### Bug Fixes

- **shell:** use spawn instead of exec
  ([80f9d63](https://github.com/JamieMason/commit-release/commit/80f9d63)),
  closes [#1](https://github.com/JamieMason/commit-release/issues/1)

### Features

- **shell:** log output
  ([2b5003d](https://github.com/JamieMason/commit-release/commit/2b5003d))

## [0.5.2](https://github.com/JamieMason/commit-release/compare/0.5.0...0.5.2) (2016-05-12)

### Bug Fixes

- **options:** fix --no-verify flag
  ([157da30](https://github.com/JamieMason/commit-release/commit/157da30)),
  closes [#4](https://github.com/JamieMason/commit-release/issues/4)
- **shell:** add support for windows
  ([c351620](https://github.com/JamieMason/commit-release/commit/c351620)),
  closes [#3](https://github.com/JamieMason/commit-release/issues/3)

# [0.5.0](https://github.com/JamieMason/commit-release/compare/0.4.0...0.5.0) (2016-03-11)

### Features

- **command:** quit if tag exists with same version
  ([79f1552](https://github.com/JamieMason/commit-release/commit/79f1552))

# [0.4.0](https://github.com/JamieMason/commit-release/compare/0.3.0...0.4.0) (2016-03-10)

### Features

- **options:** add --override option
  ([b3343dc](https://github.com/JamieMason/commit-release/commit/b3343dc))

# [0.3.0](https://github.com/JamieMason/commit-release/compare/0.1.0...0.3.0) (2016-03-02)

### Features

- **options:** add --force option
  ([0b440d1](https://github.com/JamieMason/commit-release/commit/0b440d1))
- **options:** add --no-verify option
  ([9fde500](https://github.com/JamieMason/commit-release/commit/9fde500))

# [0.1.0](https://github.com/JamieMason/commit-release/compare/493c528...0.1.0) (2016-02-20)

### Features

- **command:** create commit with changelog and correct version
  ([493c528](https://github.com/JamieMason/commit-release/commit/493c528))
