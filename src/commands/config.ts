import { input } from "@inquirer/prompts";
import { Command } from "@oclif/core";

import { readConfig, updateConfig } from "../utils/config";

export default class Config extends Command {
  static args = {};

  static description = "Configure the Progressively CLI";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  public async run(): Promise<void> {
    this.log("You'll start the configuration of the Progressively CLI");

    const config = await readConfig();

    const baseUrl = await input({
      default: config.base_url,
      message: "What is URL of your Progressively instance",
    });

    await updateConfig({
      base_url: baseUrl,
    });

    const clientKey = await input({
      default: config.client_key,
      message: "Please enter the client key",
    });

    await updateConfig({
      client_key: clientKey,
    });

    // NOTE: it's not suitable but couldn't find a proper way
    // to mock `this.config.runCommand` in tests
    if (process.env.NODE_ENV !== "test") {
      await this.config.runCommand("login");
      await this.config.runCommand("project");
    }
  }
}
