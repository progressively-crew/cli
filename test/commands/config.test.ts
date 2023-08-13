import { expect, test } from "@oclif/test";
import * as prompts from "@inquirer/prompts";
import * as configUtils from "../../src/utils/config";
import Sinon from "sinon";

const configUtilsMock = Sinon.mock(configUtils);

describe("config", () => {
  configUtilsMock.expects("updateConfig").twice();

  test
    .stdout()
    .stub(
      prompts,
      "input",
      Sinon.stub()
        .onCall(0)
        .returns("http://localhost:3000")
        .onCall(1)
        .returns("some-client-key"),
    )
    .nock("https://api.progressively.app", (api) => {
      api.get("/auth/refresh").reply(200);
    })
    .command(["config"])
    .it("should run the config prompts", (ctx) => {
      configUtilsMock.verify();

      expect(ctx.stdout).to.contain(
        "You'll start the configuration of the Progressively CLI",
      );
    });
});
