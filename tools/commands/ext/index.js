/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   BSD 3-Clause License
 *
 *   Copyright (c) 2024, Scott Motte
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions are met:
 *
 *   1. Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 *   3. Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *   AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *   IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *   DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 *   FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 *   DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 *   SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *   CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 *   OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * SPDX-License-Identifier: BSD-3-Clause AND MPL-2.0
 */

import { logger } from "@dotenvx/dotenvx/src/shared/logger.js";
import { Command } from "commander";
export const dotenvxCliExt = new Command("ext")
import path from "node:path"
import { spawnSync } from "node:child_process";
import examples from "@dotenvx/dotenvx/src/cli/examples.js"
import { vault } from "./vault.js";

dotenvxCliExt
  .description('dotenvx extensions (experiential in dotenv-tools)')
  .aliases([
    "extensions"
  ])
  .allowUnknownOption()

dotenvxCliExt
  .argument('[command]', 'dynamic ext command')
  .argument('[args...]', 'dynamic ext command arguments')
  .action((command, args, cmdObj) => {
    if (!command) {
      dotenvxCliExt.outputHelp()
      process.exit(1)
    }

    // construct the full command line manually including flags
    const rawArgs = process.argv.slice(3) // adjust the index based on where actual args start
    const commandIndex = rawArgs.indexOf(command)
    const forwardedArgs = rawArgs.slice(commandIndex + 1)

    logger.debug(`command: ${command}`)
    logger.debug(`args: ${JSON.stringify(forwardedArgs)}`)

    const binPath = path.join(process.cwd(), 'node_modules', '.bin')
    const newPath = `${binPath}:${process.env.PATH}`
    const env = { ...process.env, PATH: newPath }

    const result = spawnSync(`dotenvx-ext-${command}`, forwardedArgs, { stdio: 'inherit', env })
    if (result.error) {
      logger.info(`error: unknown command '${command}'`)
    }

    if (result.status !== 0) {
      process.exit(result.status)
    }
  })


// dotenvx ext ls
dotenvxCliExt.command("ls")
  .description("print all .env files in a tree structure")
  .argument("[directory]", "directory to list files", ".")
  .option("-f, --env-file <filenames...>", "path(s) to your .env file(s)")
  .action(await import("@dotenvx/dotenvx/src/cli/actions/ext/ls.js"))

// dotenvx ext scan
dotenvxCliExt.command("scan")
  .description('scan for leaked secrets [powered by gitleaks cli]')
  .action(await import('@dotenvx/dotenvx/src/cli/actions/ext/scan.js'))

// dotenvx ext genexample
dotenvxCliExt
  .command("genexample")
  .description("generate .env.example")
  .argument("[directory]", "directory to generate from", ".")
  .option("-f, --env-file <paths...>", "path(s) to your env file(s)", ".env")
  .action(await import("@dotenvx/dotenvx/src/cli/actions/ext/genexample.js"));

// dotenvx ext gitignore
dotenvxCliExt
  .command("gitignore")
  .description(
    "append to .gitignore file (and if existing, .dockerignore, .npmignore, and .vercelignore)"
  )
  .addHelpText("after", examples.gitignore)
  .action(await import("@dotenvx/dotenvx/src/cli/actions/ext/gitignore.js"));


// dotenvx ext prebuild
dotenvxCliExt.command('prebuild')
  .description('prevent including .env files in docker builds')
  .addHelpText('after', examples.prebuild)
  .action(await import('@dotenvx/dotenvx/src/cli/actions/ext/prebuild.js'))

// dotenvx ext precommit
dotenvxCliExt.command('precommit')
  .description('prevent committing .env files to code')
  .addHelpText('after', examples.precommit)
  .option('-i, --install', 'install to .git/hooks/pre-commit')
  .action(await import('@dotenvx/dotenvx/src/cli/actions/ext/precommit.js'))

// dotenvx ext settings
dotenvxCliExt
  .command("settings")
  .description("print current dotenvx settings")
  .argument("[key]", "settings name")
  .option("-pp, --pretty-print", "pretty print output")
  .action(await import("@dotenvx/dotenvx/src/cli/actions/ext/settings.js"));

dotenvxCliExt.addCommand(vault)