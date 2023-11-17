import { select } from "@inquirer/prompts";
import { Command } from "@oclif/core";

import { UserConfig, readUserConfig, updateUserConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Env extends Command {
  static args = {};

  static description = "List the environments of the active project";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const config = await this.guardConfig();

    const httpClient = await getHttpClient(true);

    const { data: envs } = await httpClient.get(
      `/projects/${config.project_id}/environments`,
    );

    if (envs.length === 0) {
      throw new Error(
        `There are no environments available on this project. Please, make sure to create one in the UI.`,
      );
    }

    const clientKey = await select({
      choices: envs.map((env: any) => ({
        name: env.name,
        value: env.clientKey,
      })),
      message: "Which env do you want to use?",
    });

    await updateUserConfig({
      client_key: String(clientKey),
    });

    this.log("Client key set up. You can now request your flags");
  }

  private async guardConfig(): Promise<UserConfig> {
    let config = await readUserConfig();

    while (!config.base_url) {
      // eslint-disable-next-line no-await-in-loop
      config = await this.config.runCommand("config");
    }

    while (!config.access_token) {
      // eslint-disable-next-line no-await-in-loop
      await this.config.runCommand("login");
    }

    if (!config.project_id) {
      await this.config.runCommand("project");
    }

    return config;
  }
}
