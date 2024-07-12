// from package.json to avoid experimential feature warnings
import {readFileSync} from "node:fs"
import path from "node:path"

const manifest = path.join(import.meta.dirname, "../package.json")
export const pkgMetadata = JSON.parse(readFileSync(manifest, 'utf8'))

export const encoding = "utf8"
