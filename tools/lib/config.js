import { loadConfig } from "c12"
import { getRootDir } from "./git"
import { pkgMetadata } from "./constants"

const defaultRepoConfig = {
    repoStore: pkgMetadata.repository.url,
    project: "meta"
}

const defaultSecretStoreRepoConfig = {
    projects: [
        {
            name: "meta",
            directory: "./"
        }
    ]
}

export const repoConfig = await loadConfig({
    cwd: await getRootDir(),
    configFile: ".dotenv-tools.yml",
    defaults: defaultRepoConfig,
    dotenv: false,
    globalRc: false
})

export const repoStoreConfig = await loadConfig({
    cwd: await getRootDir(),
    configFile: ".secretstore.yml",
    defaults: defaultSecretStoreRepoConfig,
    dotenv: false,
    globalRc: false
})


