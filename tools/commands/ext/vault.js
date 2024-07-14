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
import { Command } from "commander";
import examples from "@dotenvx/dotenvx/src/cli/examples.js";
import migrate from "@dotenvx/dotenvx/src/cli/actions/ext/vault/migrate.js";
import encrypt from "@dotenvx/dotenvx/src/cli/actions/ext/vault/encrypt.js";
import decrypt from "@dotenvx/dotenvx/src/cli/actions/ext/vault/decrypt.js";
import status from "@dotenvx/dotenvx/src/cli/actions/ext/vault/status.js";
export const vault = new Command("vault");

vault.description("🔐 manage .env.vault files");

// dotenvx ext vault migrate
vault
  .command("migrate")
  .description("instructions for migrating .env.vault to encrypted env file(s)")
  .action(migrate);

// dotenvx ext vault encrypt
vault
  .command("encrypt")
  .description("encrypt .env.* to .env.vault")
  .addHelpText("after", examples.vaultEncrypt)
  .argument("[directory]", "directory to encrypt", ".")
  .option("-f, --env-file <paths...>", "path(s) to your env file(s)")
  .action(encrypt);

// dotenvx ext vault decrypt
vault
  .command("decrypt")
  .description("decrypt .env.vault to .env*")
  .argument("[directory]", "directory to decrypt", ".")
  .option("-e, --environment <environments...>", "environment(s) to decrypt")
  .action(decrypt);

// dotenvx ext vault status
vault
  .command("status")
  .description(
    "compare your .env* content(s) to your .env.vault decrypted content(s)"
  )
  .argument("[directory]", "directory to check status against", ".")
  .action(status);
