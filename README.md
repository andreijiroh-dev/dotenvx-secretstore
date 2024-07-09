# `@ajhalili2006/dotenvx-secretstore`

A git-backed experiment with using dotenvx for managing CI/prod secrets. Kinda
similar to using `gopass`, but without the GPG/SSH key wrangling and web-based
dashboard chaos.

## Rationale

I am currently a Doppler user for safekeeping secrets, but plan to switch to
`dotenvx` and use plain git for audit logs. The plan is simple or complex
depending on who asked. In a nutshell:

* Store `.env` files in a central repository like this for auditing and ease of management
* Store the private keys securely in Doppler or straight to CI secrets setting.
* In each CI job, pull project-specifics and load them using `dotenvx` cli

## Requirements

* `dotenvx` cli for setup and maintenance
* basically `git` for everything else and `bash` + `nodejs`/`deno` for tools here

## Usage

### First Use Setup

```bash
# install dotenvx
curl -fsSL https://scripts.andreijiroh.xyz/tools/dotenvx | bash -s -- --directory=$HOME/.local/bin

# setup project-specifics
./bin/setup-project <project-name> [--copy-ci-secrets|--commit]

# sync with
./bin/push-secrets --repo-path=/path/to/local-copy [--upload-dotenv-keys=<gh|glab|doppler>|--no-commit] <project-name|meta> [optional-env-file]
```

### Managing secrets

```bash
cd projects/<project-name> # or stay in root directory for meta

# add a secret
dotenvx set [-f .env.ci [--plain] --] NAME somerandomtexthere

# push to repo to sync
./bin/push-secrets --repo-path=/path/to/local-copy [--upload-dotenv-keys=<gh|glab|doppler>|--no-commit] <project-name|meta> [optional-env-file]
```
