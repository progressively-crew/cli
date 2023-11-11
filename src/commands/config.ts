import { input } from "@inquirer/prompts";
import color from "@oclif/color";
import { Command, Flags } from "@oclif/core";

import { readConfig, updateConfig } from "../utils/config";

export default class Config extends Command {
  static args = {};

  static description = "Configure the Progressively CLI";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    show: Flags.boolean({
      description: "Display the current configuration for the user",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Config);
    const config = await readConfig();

    if (flags.show) {
      this.log(
        `
${color.bold("Email")} : ${color.green(config.email)}
${color.bold("Backend URL")} : ${color.green(config.base_url)}
${color.bold("Client key")} : ${color.green(config.client_key)}
        `.trim(),
      );

      return;
    }

    this.log("You'll start the configuration of the Progressively CLI");

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
