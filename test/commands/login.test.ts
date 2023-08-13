import { expect, test } from "@oclif/test";
import sinon from "sinon";
import * as prompts from "@inquirer/prompts";
import * as configUtils from "../../src/utils/config";

const configUtilsMock = sinon.mock(configUtils);

describe("login", () => {
  configUtilsMock.expects("updateConfig").thrice();

  test
    .stdout()
    .stub(prompts, "input", () => "jean@smaug.fr")
    .stub(prompts, "password", () => "azertyuiop")
    .nock("https://api.progressively.app", (api) => {
      api.post("/auth/login").reply(200, {
        access_token: "MOCK_access_token",
        refresh_token: "MOCK_refresh_token",
      });
    })
    .command(["login"])
    .it("should login a user", (ctx) => {
      configUtilsMock.verify();

      expect(ctx.stdout).to.include(
        "Your access token has been stored in the config located at /mock-current-folder/config.json",
      );
    });
});
