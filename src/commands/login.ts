import { input, password } from "@inquirer/prompts";
import { Command, ux } from "@oclif/core";
import { AxiosError } from "axios";

import { login } from "../utils/auth";
import { getConfigPath, readConfig, updateConfig } from "../utils/config";

export default class Login extends Command {
  static args = {};

  static description = "Authenticate to store tokens in config";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  public async run(): Promise<void> {
    const config = await readConfig();

    const email = await input({
      default: config.email,
      message: "What is your email",
    });

    await updateConfig({
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

      await updateConfig({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      ux.action.stop();

      await updateConfig({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      this.log(
        `Your access token has been stored in the config located at ${getConfigPath()}`,
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
