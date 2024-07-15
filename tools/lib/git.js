import { logger } from "@dotenvx/dotenvx/src/shared/logger.js";
import git from "isomorphic-git"
import fs from "node:fs"
import { cwd } from "node:process";
const gitRootDir = await import("git-root-dir");

export async function getRootDir() {
    let dir = cwd()
    return await gitRootDir.default(dir)
}

export async function stageAndCommit(file, message, skipCommit) {
    let dir = await getRootDir();
    if (typeof file == "object") {
        for (const targetFile of file) {
            logger.info(`staging ${targetFile}`)
            await git.add({ fs, directory, file: targetFile });
        }
    } else {
        await git.add({ fs, directory, file });
    }
    if (!skipCommit || skipCommit == false) {
        await git.commit({
          fs,
          dir,
          message,
          committer: {
            name: "dotenv-tools",
            email: "bot+dotenv-tools@andreijiroh.xyz"
          }
        });
    }
}