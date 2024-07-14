#!/usr/bin/env node
/* 
 * This Source Code Form is subject to the terms of the Mozilla Public
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

import { Command } from "commander";
import { collectEnvs, envs } from "../lib/env.js";
export const dotenvxCli = new Command("dotenvx")
import { dotenvxCliExt } from "./ext/index.js";
import { pkgMetadata } from "../lib/constants.js";
import upstreamMetadata from "@dotenvx/dotenvx/src/lib/helpers/packageJson.js";

dotenvxCli
    .description("access dotenvx cli features via dotenv-tools (experimential)")
    .version(`${upstreamMetadata.version} (@andreijiroh-dev/dotenv-tools@v${pkgMetadata.version})`)


import get from "@dotenvx/dotenvx/src/cli/actions/get.js";
import set from "@dotenvx/dotenvx/src/cli/actions/set.js";
import decrypt from "@dotenvx/dotenvx/src/cli/actions/decrypt.js";
import run from "@dotenvx/dotenvx/src/cli/actions/run.js";
import encrypt from "@dotenvx/dotenvx/src/cli/actions/encrypt.js";
import * as examples from "@dotenvx/dotenvx/src/cli/examples.js";
import { logger, setLogLevel } from "@dotenvx/dotenvx/src/shared/logger.js";

dotenvxCli
  .option("-l, --log-level <level>", "set log level", "info")
  .option("-q, --quiet", "sets log level to error")
  .option("-v, --verbose", "sets log level to verbose")
  .option("-d, --debug", "sets log level to debug")
  .hook("preAction", (thisCommand, actionCommand) => {
    const options = thisCommand.opts();

    setLogLevel(options);
  });

dotenvxCli
    .action((command, args, cmdObj) => {
      if (!command) {
        ext.outputHelp()
        process.exit(1)
      }
    })

dotenvxCli
  .command("run")
  .description("inject env at runtime [dotenvx run -- yourcommand]")
  .addHelpText("after", examples.run)
  .option(
    "-e, --env <strings...>",
    'environment variable(s) set as string (example: "HELLO=World")',
    collectEnvs("env"),
    []
  )
  .option(
    "-f, --env-file <paths...>",
    "path(s) to your env file(s)",
    collectEnvs("envFile"),
    []
  )
  .option(
    "-fv, --env-vault-file <paths...>",
    "path(s) to your .env.vault file(s)",
    collectEnvs("envVaultFile"),
    []
  )
  .option("-o, --overload", "override existing env variables")
  .option(
    "--convention <name>",
    "load a .env convention (available conventions: ['nextjs'])"
  )
  .action(function (...args) {
    this.envs = envs;

    run.apply(this, args);
  });

dotenvxCli
  .command("set")
  .description("set a single environment variable")
  .addHelpText("after", examples.set)
  .allowUnknownOption()
  .argument("KEY", "KEY")
  .argument("value", "value")
  .option("-f, --env-file <paths...>", "path(s) to your env file(s)", ".env")
  .option("-c, --encrypt", "encrypt value (default: true)", true)
  .option("-p, --plain", "store value as plain text", false)
  .action(set);

dotenvxCli.command("get")
    .description('return a single environment variable')
    .argument('[key]', 'environment variable name')
    .option('-e, --env <strings...>', 'environment variable(s) set as string (example: "HELLO=World")', collectEnvs('env'), [])
    .option('-f, --env-file <paths...>', 'path(s) to your env file(s)', collectEnvs('envFile'), [])
    .option('-fv, --env-vault-file <paths...>', 'path(s) to your .env.vault file(s)', collectEnvs('envVaultFile'), [])
    .option('-o, --overload', 'override existing env variables')
    .option('--convention <name>', 'load a .env convention (available conventions: [\'nextjs\'])')
    .option('-a, --all', 'include all machine envs as well')
    .option('-pp, --pretty-print', 'pretty print output')
    .action(function (...args) {
        this.envs = envs

        get.apply(this, args)
    })

.command("encrypt")
    .description("convert .env file(s) to encrypted .env file(s)")
    .option('-f, --env-file <paths...>', 'path(s) to your env file(s)')
    .option('-k, --key <keys...>', 'keys(s) to encrypt (default: all keys in file)')
    .option("--stdout", "send to stdout")
    .action(encrypt)
    .alias("enc")

dotenvxCli
  .command("decrypt")
  .description("convert encrypted .env file(s) to plain .env file(s)")
  .option("-f, --env-file <paths...>", "path(s) to your env file(s)")
  .option(
    "-k, --key <keys...>",
    "keys(s) to encrypt (default: all keys in file)"
  )
  .option("--stdout", "send to stdout")
  .action(decrypt)
  .alias("dec");


// TODO: Add ent command in the future once added upstream
dotenvxCli
  .command("pro")
  .description("🏆 pro (coming soon!)")
  .action(function (...args) {
    try {
      // execute `dotenvx-pro` if available
      execSync("dotenvx-pro", { stdio: ["inherit", "inherit", "ignore"] });
    } catch (_error) {
      logger.warn(
        "upstream: dotenvx pro -- coming soon for small businesses"
      );
      logger.help(
        "upstream: learn more / subscribe to get notified: [https://github.com/dotenvx/dotenvx/issues/259]"
      );
      logger.success("upstream: thank you for using dotenvx (from: @motdotla) - [https://github.com/sponsors/motdotla]");
    }
  });

// load cli extensions too
dotenvxCli.addCommand(dotenvxCliExt)

dotenvxCli.parse(process.argv)