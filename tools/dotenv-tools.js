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
import { decrypt } from "./commands/decrypt.js";
import encrypt from "@dotenvx/dotenvx/src/cli/actions/encrypt.js";
import { pkgMetadata } from "./lib/constants.js";
import { dotenvxCli } from "./commands/dotenvx.js";
import { dotenvxCliExt } from "./commands/ext/index.js";
import { setLogLevel } from "@dotenvx/dotenvx/src/shared/logger.js";
import { collectEnvs, envs } from "./lib/env.js"
import upstreamMetadata from '@dotenvx/dotenvx/src/lib/helpers/packageJson.js'
import executeCommand from "@dotenvx/dotenvx/src/cli/actions/run.js";

const program = new Command();

program
  .option('-l, --log-level <level>', 'set log level', 'info')
  .option('-q, --quiet', 'sets log level to error')
  .option('-v, --verbose', 'sets log level to verbose')
  .option('-d, --debug', 'sets log level to debug')
  .hook('preAction', (thisCommand, actionCommand) => {
    const options = thisCommand.opts()

    setLogLevel(options)
  })

program
    .name("dotenv-tools")
    .version(`${pkgMetadata.version} (@dotenvx/dotenvx@${upstreamMetadata.version})`)
    .description(pkgMetadata.description)

program.command("init")
    .description("setup a fresh centralized git repo for dotenvx management")
    .alias("setup")

program.command("encrypt")
    .description("convert .env file(s) to encrypted .env file(s)")
    .option('-f, --env-file <paths...>', 'path(s) to your env file(s)')
    .option('-k, --key <keys...>', 'keys(s) to encrypt (default: all keys in file)')
    .action(encrypt)
    .alias("enc")

program.command("decrypt")
    .description("convert encrypted .env file(s) into plain .env file(s)")
    .argument("[file]", "file path to write decrypted secrets, otherwise print to console")
    .option('-f, --env-file <paths...>', 'path(s) to your env file(s)')
    .option('-k, --key <keys...>', 'keys(s) to encrypt (default: all keys in file)')
    .action(decrypt)
    .alias("dec")

program.command("run")
  .description("inject env at runtime")
  .option('-e, --env <strings...>', 'environment variable(s) set as string (example: "HELLO=World")', collectEnvs('env'), [])
  .option('-f, --env-file <paths...>', 'path(s) to your env file(s)', collectEnvs('envFile'), [])
  .option('-fv, --env-vault-file <paths...>', 'path(s) to your .env.vault file(s)', collectEnvs('envVaultFile'), [])
  .option('-o, --overload', 'override existing env variables')
  .option('--convention <name>', 'load a .env convention (available conventions: [\'nextjs\'])')
  .action(function (...args) {
    this.envs = envs

    executeCommand.apply(this, args)
  })

// overide helpInformation to hide DEPRECATED commands
program.helpInformation = function () {
    const originalHelp = Command.prototype.helpInformation.call(this)
    const lines = originalHelp.split('\n')

    // Filter out the hidden command from the help output
    const filteredLines = lines.filter(line => !line.includes('DEPRECATED'))

    return filteredLines.join('\n')
}

program.addCommand(dotenvxCli)
program.addCommand(dotenvxCliExt)

program.parse(process.argv)
