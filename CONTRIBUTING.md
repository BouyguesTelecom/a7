# Contributing to A7

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to A7, which is hosted in the [Bouygues Telecom Organization](https://github.com/bouyguestelecom) on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

**Table Of Contents:**

[Code of Conduct](#code-of-conduct)

[How to contribute](#how-to-contribute)

[Styleguides](#styleguides)

## Code of Conduct

This project, and everyone participating in it, are governed by the [Bouygues Telecom Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [MBX_OPENSOURCE@bouyguestelecom.fr](mailto:MBX_OPENSOURCE@bouyguestelecom.fr).

## How to contribute

### Pull Requests

The process described here has several goals:

* Maintain the product quality
* Fix problems that are important to users
* Engage the community in working toward the best possible product
* Enable a sustainable system for the product's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
  * :art: `:art:` when improving the format/structure of the code
  * :sparkles: `:sparkles:` when adding a new feature
  * :racehorse: `:racehorse:` when improving performance
  * :memo: `:memo:` when writing docs
  * :bug: `:bug:` when fixing a bug
  * :fire: `:fire:` when removing code or files
  * :green_heart: `:green_heart:` when fixing the CI build
  * :white_check_mark: `:white_check_mark:` when adding tests
  * :lock: `:lock:` when dealing with security
  * :arrow_up: `:arrow_up:` when upgrading dependencies
  * :arrow_down: `:arrow_down:` when downgrading dependencies
  * :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript and TypeScript code must adhere to [ESlint recommended rules](https://eslint.org/docs/rules/) as configured in the [ESlint configuration file](.eslintrc.js).

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown)
* Use [markdownlint](https://github.com/DavidAnson/markdownlint) to ensure style consistency
