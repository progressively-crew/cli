import { Hook } from "@oclif/core";

import { refreshAccessToken } from "../../utils/auth";
import { updateUserConfig } from "../../utils/config";

const commandsToSkip = new Set(["login", "duck", "config", "--version"]);

const hook: Hook<"init"> = async function (opts) {
  if (opts.id && commandsToSkip.has(opts.id)) return;

  try {
    const { access_token, refresh_token } = await refreshAccessToken();

    if (access_token && refresh_token) {
      await updateUserConfig({
        access_token,
        refresh_token,
      });
    }
  } catch {
    // silent fail for now. The user will be authenticated anyways since the
    // commands are now cascading up
  }
};

export default hook;
