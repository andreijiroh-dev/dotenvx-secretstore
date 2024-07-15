import { loadConfig } from "c12"
import { getRootDir } from "./git.js"
import { pkgMetadata } from "./constants.js"
import fs from "node:fs"
import { logger } from "@dotenvx/dotenvx/src/shared/logger.js"

function checkIfExists(file) {
  if (!fs.existsSync(file)) {
    logger.debug(`${process.cwd()}/${file} doesn't exist`);
    return false;
  }
  logger.debug(`${process.cwd()}/${file} exist`);
  return true;
}

export const defaultRepoConfig = {
  repoStore: {
    url: pkgMetadata.repository.url,
    cloneDirectory: ".secretstore",
  },
  sourceProject: {
    name: "meta",
    rawUrlPrefix: `${pkgMetadata.repository.url}/raw/main/`,
  },
  commitInfo: {
    name: "dotenv-tools",
    email: "dotenv-tools@andreijiroh.xyz",
  },
};

export const defaultSecretStoreRepoConfig = {
    projects: [
        {
            name: "meta",
            directory: "."
        }
    ],
    commitInfo: {
        name: "dotenv-tools",
        email: "dotenv-tools@andreijiroh.xyz"
    }
}

export const projectRepoConfig = await loadConfig({
  cwd: await getRootDir(),
  name: "dotenv-tools",
  configFile: ".envtools.yml",
  rcFile: ".envtoolsrc",
  dotenv: false,
  globalRc: false
})

export const secretStoreConfig = await loadConfig({
  cwd: await getRootDir(),
  name: "dotenvx-secretstore",
  configFile: ".secretstore.yml",
  rcFile: ".secretstorerc",
  dotenv: false,
  globalRc: false,
});

export const config = {
  secretStore: secretStoreConfig.config,
  projectRepo: projectRepoConfig.config
}