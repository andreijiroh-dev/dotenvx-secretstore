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

dotenvxCli
    .description("access dotenvx cli features via dotenv-tools (experimential)")

dotenvxCli
    .action((command, args, cmdObj) => {
      if (!command) {
        ext.outputHelp()
        process.exit(1)
      }
    })


import get from "@dotenvx/dotenvx/src/cli/actions/get.js"
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

dotenvxCli.addCommand(dotenvxCliExt)