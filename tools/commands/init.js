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
import * as fs from "fs";
import path from "node:path"
import git from "isomorphic-git"
import { fileURLToPath } from "url";

/**
 * Path to template directory for cross-compat chaos
 *
 * @type {string}
 */
const templatePath = fileURLToPath(
  path.join(import.meta.url, "../../template"));
/**
 * Current working directory based on `process.cwd()`.
 *
 * @type {string}
 */
let pwd = process.cwd();

/**
 * Check if a file exists or not
 *
 * @param {string} file
 * @returns {boolean}
 */
function checkIfExists(file) {
    if (!fs.existsSync(file)) {
        logger.debug(`${pwd}/${file} doesn't exist`)
        return false
    }
    logger.debug(`${pwd}/${file} exist`);
    return true
}

/**
 * Copy or overwrite a file from the template directory.
 *
 * @async
 * @param {string} file Path to file from the template directory
 * @param {boolean|null} override Whenever to overwrite the file or not
 * @returns {*}
 */
async function copyOrOverride(file, override) {
    if (!checkIfExists(file)) {
        logger.info(`copying ${templatePath}/${file} to ${pwd}`)
        await copyFile(
          `${templatePath}/${file}`,
          `${pwd}/${file}`,
          fs.constants.COPYFILE_EXCL
        );
    } else if (override == true) {
        logger.info(`ovewriting ${pwd}/${file} with contents of ${templatePath}/${file}`);
        await copyFile(`${templatePath}/${file}`, `${pwd}/${file}`);
    }
    logger.info(`skipping copying ${file}`)
}

/**
 * Main function for the `setup|init` command in CLI.
 *
 * @export
 * @async
 * @param {string} directory
 * @returns {*}
 */
export async function setupRepo(directory) {
    logger.debug(`directory: ${directory}`);
    const options = this.opts();
    logger.debug(`options: ${JSON.stringify(options)}`);

    if (!directory) {
      if (!options.copyMissing && !options.overwrite) {
        logger.warn(
          "you can't use this command without adding `--copy-missing` or `--overwrite` flag in this directory"
        );
        process.exit(1);
      } else if (options.copyMissing || options.override) {
        await copyOrOverride(".env", options.overwrite);
        await copyOrOverride(".env.ci", options.overwrite);
        await copyOrOverride("README.md", options.overwrite);
        await copyOrOverride(".gitignore", options.overwrite);
      }
    } else if (directory) {
        logger.info(`copying template files to ${pwd}/${directory}`)
        await cp(templatePath, `${pwd}/${directory}`, {
        recursive: true,
        force: options.overwrite || false,
      });
    }
    git.init({ fs, dir: directory, defaultBranch: "main" }).then(logger.success(`successfully initialized git repo`));
}