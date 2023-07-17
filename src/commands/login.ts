import { Args, Command, Flags, ux } from "@oclif/core";
import { AxiosError } from "axios";
import { getConfigPath, readConfig, updateConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Login extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: "f" }),
  };

  static args = {
    file: Args.string({ description: "file to read" }),
  };

  public async run(): Promise<void> {
    const config = await readConfig();

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

      const {
        data: { access_token: accessToken },
        headers,
      } = await httpClient.post("/auth/login", {
        username: email,
        password,
      });

      const refreshTokenCookie = headers["set-cookie"]
        ?.find((cookie: string) => cookie.includes("refresh-token"))
        ?.split(";")
        .find((str: string) => str.includes("refresh-token"));

      const refreshTokenMatch = /refresh-token=(?<token>.*)/.exec(
        refreshTokenCookie || ""
      );

      const refreshToken = refreshTokenMatch?.groups?.token || "";

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
