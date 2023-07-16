import { Args, Command, Flags, ux } from "@oclif/core";
import { AxiosError } from "axios";
import { getConfigPath, updateConfig } from "../utils/config";
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
    const email = await ux.prompt("What is your email?");
    const password = await ux.prompt("What is your passowrd?", {
      type: "hide",
    });

    const httpClient = await getHttpClient();

    try {
      const { data } = await httpClient.post("/auth/login", {
        username: email,
        password,
      });

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
