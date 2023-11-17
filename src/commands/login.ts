import { input, password } from "@inquirer/prompts";
import { Command, ux } from "@oclif/core";
import { AxiosError } from "axios";

import { login } from "../utils/auth";
import {
  UserConfig,
  getUserConfigPath,
  readUserConfig,
  updateUserConfig,
} from "../utils/config";

export default class Login extends Command {
  static args = {};

  static description = "Authenticate to store tokens in config";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  public async run(): Promise<UserConfig | undefined> {
    const config = await this.guardConfig();

    const email = await input({
      default: config.email,
      message: "What is your email",
    });

    await updateUserConfig({
      email,
    });

    const userPassword = await password({
      mask: "*",
      message: "What is your password?",
    });

    try {
      ux.action.start("Authentication");

      const { access_token: accessToken, refresh_token: refreshToken } =
        await login({
          email,
          password: userPassword,
        });

      await updateUserConfig({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      ux.action.stop();

      const nextConfig = await updateUserConfig({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      this.log(
        `Your access token has been stored in the config located at ${getUserConfigPath()}`,
      );

      return nextConfig;
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

  private async guardConfig(): Promise<UserConfig> {
    let config = await readUserConfig();

    while (!config.base_url) {
      // eslint-disable-next-line no-await-in-loop
      config = await this.config.runCommand("config");
    }

    return config;
  }
}
