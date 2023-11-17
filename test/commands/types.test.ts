import { expect, test } from "@oclif/test";
import fsPromises from "node:fs/promises";
import sinon from "sinon";

import * as configUtils from "../../src/utils/config";

const apiRoot = "https://api.progressively.app";

process.cwd = () => "/mock-current-folder";

describe("types", () => {
  const fsPromisesMock = sinon.mock(fsPromises);
  fsPromisesMock
    .expects("writeFile")
    .withArgs(
      "/mock-current-folder/progressively.d.ts",
      'declare module "@progressively/types" {\n' +
        "  export interface FlagDict {\n" +
        "    background: boolean;\n" +
        "  }\n" +
        "  export interface FlagDictWithCustomString {\n" +
        "    background: string | boolean;\n" +
        "  }\n" +
        "}\n",
    )
    .once();

  after(() => {
    fsPromisesMock.restore();
  });

  test
    .stub(configUtils, "readUserConfig", () => ({
      access_token: "yo",
      base_url: apiRoot,
      client_key: "abcd",
      project_id: "1",
    }))
    .nock(apiRoot, (api) =>
      api
        .get("/sdk/abcd/types/gen")
        .reply(
          200,
          'declare module "@progressively/types" {export interface FlagDict {background: boolean;}export interface FlagDictWithCustomString {background: string | boolean;}}',
        ),
    )
    .stdout()
    .command(["types"])
    .it("should generate a formatted type definition file", (ctx) => {
      expect(ctx.stdout).to.contain("Your types file has been generated at");

      fsPromisesMock.verify();
    });
});
