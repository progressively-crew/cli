import { Command, ux } from "@oclif/core";
import { getConfigPath, readConfig, updateConfig } from "../utils/config";
import { AxiosError } from "axios";
import { getHttpClient } from "../utils/http";

export default class Config extends Command {
  static description = "Configure the Progressively CLI";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    this.log("You'll start the configuration of the Progressively CLI");

    const config = await readConfig();

    const baseUrl = await ux.prompt(
      "What is URL of your Progressively instance?",
      { default: config.base_url }
    );

    await updateConfig({
      base_url: baseUrl,
    });

    /**
     * AUTHENTICATION
     */

    const email = await ux.prompt("What is your email?", {
      default: config.email,
    });

    await updateConfig({
      email,
    });

    const password = await ux.prompt("What is your password?", {
      type: "hide",
    });

    const httpClient = await getHttpClient();

    try {
      ux.action.start("Authentication");

      const { data } = await httpClient.post("/auth/login", {
        username: email,
        password,
      });

      ux.action.stop();

      await updateConfig(data);

      this.log(
        `Your access token has been stored in the config located at ${getConfigPath()}`
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 401: {
            this.log("Unauthorized, check the credentials you provided");
            break;
          }

          case 404: {
            this.log("Endpoint cound't be found");
            break;
          }

          default: {
            this.log("Unknown issue");
            this.error(error);
          }
        }
      }
    }
  }
}
