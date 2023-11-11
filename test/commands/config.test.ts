import * as prompts from "@inquirer/prompts";
import { expect, test } from "@oclif/test";
import Sinon from "sinon";

import * as configUtils from "../../src/utils/config";

describe("config", () => {
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
    .stub(
      prompts,
      "input",
      Sinon.stub()
        .onCall(0)
        .returns("http://localhost:3000")
        .onCall(1)
        .returns("some-client-key"),
    )
    // .nock("https://api.progressively.app", (api) => {
    //   api.get("/auth/refresh").reply(200);
    // })
    .command(["config"])
    .it("should run the config prompts", (ctx) => {
      configUtilsMock.verify();

      expect(ctx.stdout).to.contain(
        "You'll start the configuration of the Progressively CLI",
      );
    });
});
