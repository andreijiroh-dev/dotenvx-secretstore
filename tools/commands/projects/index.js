import {Command} from "commander"
import { config } from "../../lib/config.js"
import { logger } from "@dotenvx/dotenvx/src/shared/logger.js"
const Table = await import("cli-table3")
export const projectsCli = new Command("projects")

projectsCli
  .description("manage projects")

projectsCli.command("add")
  .description("add a new project")
  .argument("project", "project name")
  .alias("new")

projectsCli.command("ls")
  .action(function() {
    const projectList = config.secretStore.projects;
    if (!projectList) {
      logger.error(`missing secretstore config, maybe try again in git root directory (hint: not the .git/ folder itself)`)
      process.exit(1)
    }
    const table = new Table.default({
      head: ["Projects", "Directory (relative to root dir)"],
    });

    projectList.forEach(element => {
      table.push([element["name"], element["directory"]])
    });

    console.log(table.toString())
  })