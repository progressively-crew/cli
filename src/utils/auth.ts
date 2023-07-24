import { Config, readConfig } from "./config";
import { getHttpClient } from "./http";

function extractRefreshToken(headers: any) {
  const refreshTokenCookie = headers["set-cookie"]
    ?.find((cookie: string) => cookie.includes("refresh-token"))
    ?.split(";")
    .find((str: string) => str.includes("refresh-token"));

  const refreshTokenMatch = /refresh-token=(?<token>.*)/.exec(
    refreshTokenCookie || ""
  );

  const refreshToken = refreshTokenMatch?.groups?.token || "";

  return refreshToken;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Pick<Config, "access_token" | "refresh_token">> {
  const httpClient = await getHttpClient();

  const {
    data: { access_token: accessToken },
    headers,
  } = await httpClient.post("/auth/login", {
    username: email,
    password,
  });

  const refreshToken = extractRefreshToken(headers);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

export async function refreshAccessToken(): Promise<void> {
  const httpClient = await getHttpClient();
  const { refresh_token } = await readConfig();

  const { data, headers } = await httpClient.get("/auth/refresh", {
    headers: {
      Cookie: `refresh-token=${refresh_token}`,
    },
  });

  const refreshToken = extractRefreshToken(headers);

  console.log(data, refreshToken);
}
