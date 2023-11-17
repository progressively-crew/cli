import { input, password } from "@inquirer/prompts";
import { Command, ux } from "@oclif/core";

import { login } from "../utils/auth";
import { UserConfig, readUserConfig, updateUserConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Register extends Command {
  static args = {};

  static description = "Register an admin user";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  public async run(): Promise<void> {
    await this.guardConfig();
    const httpClient = await getHttpClient();

    const fullname = await input({ message: "What is your fullname" });
    const email = await input({ message: "What is your email" });
    const passwordPrompt = await password({ message: "What is your password" });

    ux.action.start("Authenticating");

    try {
      const response = await httpClient.post("/auth/register", {
        email,
        fullname,
        password: passwordPrompt,
      });

      if (response.status === 201) {
        const { data: user } = response;

        try {
          const { access_token: accessToken, refresh_token: refreshToken } =
            await login({ email, password: passwordPrompt });

          await updateUserConfig({
            access_token: accessToken,
            email,
            refresh_token: refreshToken,
          });
        } catch {
          this.log(
            "Registration worked but we login failed. Try to run progressively login",
          );
        }

        ux.action.stop();

        this.log(`${user.fullname}, your account has been created 🎉`);
      }
    } catch {
      this.error(
        "An error has been detected. Did you already create the admin user?",
      );
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
