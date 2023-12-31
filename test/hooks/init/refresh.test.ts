import { expect, test } from "@oclif/test";
import Sinon from "sinon";

import * as configUtils from "../../../src/utils/config";

describe("hooks", () => {
  let configUtilsMock: Sinon.SinonMock;

  before(() => {
    configUtilsMock = Sinon.mock(configUtils);
  });

  after(() => {
    configUtilsMock.restore();
  });

  test
    .stdout()
    .stub(configUtils, "readUserConfig", () => ({
      access_token: "yo",
      base_url: "https://api.progressively.app",
      project_id: "1",
      secret_key: "abcd",
    }))
    .nock("https://api.progressively.app", (api) => {
      api.get("/auth/refresh").reply(200, {
        access_token: "MOCK_access_token",
        refresh_token: "MOCK_refresh_token",
      });
    })
    .hook("init", { id: "some-command-that-is-not-skiped" })
    .do((output) => {
      configUtilsMock.expects("updateUserConfig").once();
      expect(output.stdout).to.contain("");
    })
    .it("should refresh token");

  test
    .stdout()
    .hook("init", { id: "duck" })
    .do((output) => {
      configUtilsMock.expects("updateUserConfig").never();
      expect(output.stdout).to.contain("");
    })
    .it("shouldn't refresh token");
});
