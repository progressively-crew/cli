import { Command } from "@oclif/core";
import { getHttpClient } from "../utils/http";

export default class Me extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const httpClient = await getHttpClient(true);

    const { data } = await httpClient.get("/users/me");

    this.log(
      `
Full name : ${data.fullname}
Email     : ${data.email}
    `.trim(),
    );
  }
}
