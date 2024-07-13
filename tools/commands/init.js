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
import { logger } from "@dotenvx/dotenvx/src/shared/logger.js";
import { cp, copyFile } from "fs/promises"
import { existsSync, openSync } from "fs";
import path from "node:path"
import { fileURLToPath } from "url";

const templatePath = fileURLToPath(
  path.join(import.meta.url, "../../template"));

function checkIfExists(file) {
    if (!existsSync(file)) {
        return false
    }
    return true
}

async function copyOrOverride(file, override) {
    if (!checkIfExists(file)) {
        await copyFile(`${templatePath}/README.md`, `${pwd}/README.md`)
    }
}

export async function setupRepo(directory) {
    logger.debug(`directory: ${directory}`);
    const options = this.opts();
    logger.debug(`options: ${JSON.stringify(options)}`);
    let pwd = process.cwd()

    if (directory == null && options.copyMissing !== true) {
        logger.warn("you can't use this command without adding `--copy-missing` flag in this directory")
        process.exit(1)
    } else if (directory == null && options.copyMissing == true) {
        if (!checkIfExists(`${pwd}/.env`)) {
            logger.verbose("creating blank .env")
            openSync(`${pwd}/.env`, "a");
        }

        if (!checkIfExists(`${pwd}/README.md`)) {
            logger.verbose(`copying template README from "${templatePath}/README.md"`)
            await copyFile(`${templatePath}/README.md`, `${pwd}/README.md`)
        }
    } else {
        await cp(templatePath, destdir, { recursive: true, force: true });
    }
}