import { Command, ux } from "@oclif/core";
import { input, password } from "@inquirer/prompts";
import { getHttpClient } from "../utils/http";
import { login } from "../utils/auth";
import { updateConfig } from "../utils/config";

export default class Register extends Command {
  static description = "Register an admin user";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const httpClient = await getHttpClient();

    const fullname = await input({ message: "What is your fullname" });
    const email = await input({ message: "What is your email" });
    const passwordPrompt = await password({ message: "What is your password" });

    ux.action.start("Authenticating");

    try {
      const response = await httpClient.post("/auth/register", {
        fullname,
        email,
        password: passwordPrompt,
      });

      switch (response.status) {
        case 201: {
          const { data: user } = response;

          try {
            const { access_token: accessToken, refresh_token: refreshToken } =
              await login({ email, password: passwordPrompt });

            await updateConfig({
              access_token: accessToken,
              refresh_token: refreshToken,
              email,
            });
          } catch {
            this.log(
              "Registration worked but we login failed. Try to run progressively login"
            );
          }

          ux.action.stop();

          this.log(`${user.fullname}, your account has been created 🎉`);
          break;
        }

        default:
          break;
      }
    } catch {
      this.error(
        "An error has been detected. Did you already create the admin user?"
      );
    }
  }
}
