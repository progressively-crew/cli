import { expect, test } from "@oclif/test";
import Sinon from "sinon";
import * as prompts from "@inquirer/prompts";
import * as configUtils from "../../src/utils/config";

describe("login", () => {
  let configUtilsMock: Sinon.SinonMock;

  before(() => {
    configUtilsMock = Sinon.mock(configUtils);
    configUtilsMock.expects("updateConfig").twice();
  });

  after(() => {
    configUtilsMock.restore();
  });

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
