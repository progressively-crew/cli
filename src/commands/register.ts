import { Command, ux } from "@oclif/core";
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

    const fullname = await ux.prompt("What is your fullname?");
    const email = await ux.prompt("What is your email?");
    const password = await ux.prompt("What is your password?", {
      type: "hide",
    });

    try {
      const response = await httpClient.post("/auth/register", {
        fullname,
        email,
        password,
      });

      switch (response.status) {
        case 201: {
          const { data: user } = response;

          try {
            const { access_token: accessToken, refresh_token: refreshToken } =
              await login({ email, password });

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
