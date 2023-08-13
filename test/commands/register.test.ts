import { expect, test } from "@oclif/test";
import * as prompts from "@inquirer/prompts";
import Sinon from "sinon";
import * as configUtils from "../../src/utils/config";

describe("register", () => {
  let configUtilsMock: Sinon.SinonMock;

  before(() => {
    configUtilsMock = Sinon.mock(configUtils);
    configUtilsMock.expects("updateConfig").once();
  });

  after(() => {
    configUtilsMock.restore();
  });

  test
    .stdout()
    .stub(
      prompts,
      "input",
      Sinon.stub()
        .onCall(0)
        .returns("Jean Smaug")
        .onCall(1)
        .returns("jean@smaug.fr"),
    )
    .stub(prompts, "password", () => "azertyuiop")
    .nock("https://api.progressively.app", (api) => {
      api.post("/auth/register").reply(201, {
        fullname: "Jean Smaug",
      });

      api.post("/auth/login").reply(200, {
        access_token: "MOCK_access_token",
        refresh_token: "MOCK_refresh_token",
      });

      api.get("/auth/refresh").reply(200);
    })
    .command(["register"])
    .it("should register an admin", (ctx) => {
      configUtilsMock.verify();

      expect(ctx.stdout).to.include(
        "Jean Smaug, your account has been created 🎉",
      );
    });
});
