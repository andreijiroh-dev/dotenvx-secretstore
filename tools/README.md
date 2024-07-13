# `dotenvx-tools`

> [!warning]
> This tool is experimental, especially since we're slowly integrating
> `dotenvx` features under the `dotenv-tools dotenvx` prefix. If you need
> these, consult [the upstream repository](https://github.com/dotenvx/dotenvx)

## Features

* [x] Set up and manage dotenvx-backed monorepos, similar to `gopass`, `pass`
* [x] Access most of `dotenvx` commands via `dotenv-tools dotenvx` command prefix

## Install and docs

Visit <https://wiki.andreijiroh.xyz/garden/tools/dotenv-tools/> for a
comprehensive documentation.

```bash
# Install globally via npm
npm i -g @andreijiroh-dev/dotenv-tools

# or use npx
npx @andreijiroh-dev/dotenv-tools
```

### From source

```bash
git clone https://mau.dev/andreijiroh-dev/dotenvx-secretstore
cd dotenvx-secretstore/tools
npm link --local .

# update via git
git pull --ff-only
```

## License

BSD-3-Clause and MPL-2.0

Portions of the code from `@dotenvx/dotenvx` CLI codebase under BSD 3-Clause,
which the contents of this directory has been adopted as part of dual-licensing
setup.
