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
import { get } from "@dotenvx/dotenvx/src/lib/main.js"
import { envs, collectEnvs } from "../lib/env.js"
import { logger } from "@dotenvx/dotenvx/src/shared/logger.js"
import { writeFileSync} from "node:fs"
import { encoding } from "../lib/constants.js"

/* This is a hack from https://github.com/dotenvx/dotenvx/issues/280#issuecomment-2198449380
 * but instead of parsing the JSON from dotenvx, we write them as we do
 */
export function decrypt(file) {
    const options = this.opts()
    logger.debug(`outputFile: ${file}`)
    logger.debug(`options: ${JSON.stringify(options)}`)
    let exportFileOutput = file || `.env.decrypted`

    const value = get(undefined, envs, options.overload, process.env.DOTENV_KEY, options.all)

    if (typeof value === 'object' && value !== null) {
        let decryptedSecrets = ""
        for (const key of Object.keys(value)) {
            if (key.startsWith("DOTENV")) continue;
            if (value[key].startsWith("encrypted:")) {
                logger.warn(`decryption failed for secret ${key}, skipping for now`)
                continue
            }
            decryptedSecrets += `${key}=${value[key]}\n`;
        }
        if (exportFileOutput == "-") {
          logger.info(decryptedSecrets)
        } else {
          writeFileSync(exportFileOutput, decryptedSecrets, encoding)
          logger.success(`✔ successfully exported decrypted secrets to ${exportFileOutput}`)
        }
      } else {
        if (value === undefined) {
          logger.info("no secrets found")
          process.exit(1)
        } else {
          logger.blank0(value)
        }
      }
}