import { Config, readConfig } from "./config";
import { getHttpClient } from "./http";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Pick<Config, "access_token" | "refresh_token">> {
  const httpClient = await getHttpClient();

  const {
    data: { access_token, refresh_token },
  } = await httpClient.post("/auth/login", {
    password,
    username: email,
  });

  return {
    access_token,
    refresh_token,
  };
}

export async function refreshAccessToken(): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  const httpClient = await getHttpClient(true);
  const { refresh_token: currentRefreshToken } = await readConfig();

  const {
    data: { access_token, refresh_token },
  } = await httpClient.get("/auth/refresh", {
    headers: {
      "refresh-token": currentRefreshToken,
    },
  });

  return { access_token, refresh_token };
}
