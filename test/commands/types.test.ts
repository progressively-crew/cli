import { expect, test } from "@oclif/test";
import sinon from "sinon";
import fsPromises from "node:fs/promises";

const fsPromisesMock = sinon.mock(fsPromises);

describe("types", () => {
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

  test
    .nock("https://api.progressively.app", (api) =>
      api
        .get("/sdk/undefined/types/gen")
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
