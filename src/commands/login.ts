import { Command, ux } from "@oclif/core";
import { AxiosError } from "axios";
import { getConfigPath, readConfig, updateConfig } from "../utils/config";
import { login } from "../utils/auth";
import { input, password } from "@inquirer/prompts";

export default class Login extends Command {
  static description = "Authenticate to store tokens in config";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const config = await readConfig();

    const email = await input({
      message: "What is your email",
      default: config.email,
    });

    await updateConfig({
      email,
    });

    const userPassword = await password({
      message: "What is your password?",
      mask: "*",
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
      console.log("🚀 ~ file: login.ts:55 ~ Login ~ run ~ error:", error);
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
