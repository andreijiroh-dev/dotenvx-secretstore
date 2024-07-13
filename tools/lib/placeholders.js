import { logger } from "@dotenvx/dotenvx/src/shared/logger.js";

export async function tbdPlaceholder() {
  logger.help("To be implemented soon, currently a placeholder for now.");
  process.exit();
}

export async function commandDisabled() {
    logger.warn("this command is currently disabled in dotenv-tools")
    logger.help("learn more: [https://go.andreijiroh.xyz/dotenv-tools/disabled-commands")
}