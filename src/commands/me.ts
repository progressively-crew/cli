import { Command } from "@oclif/core";

import { UserConfig, readUserConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Me extends Command {
  static args = {};

  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  public async run(): Promise<void> {
    await this.guardConfig();

    const httpClient = await getHttpClient(true);

    const { data } = await httpClient.get("/users/me");

    this.log(
      `
Full name : ${data.fullname}
Email     : ${data.email}
    `.trim(),
    );
  }

  private async guardConfig(): Promise<UserConfig> {
    let config = await readUserConfig();

    while (!config.access_token) {
      // eslint-disable-next-line no-await-in-loop
      config = await this.config.runCommand("login");
    }

    return config;
  }
}
