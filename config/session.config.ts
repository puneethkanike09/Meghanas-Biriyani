export const ACCESS_TOKEN_COOKIE = "mb_access_token";
export const REFRESH_TOKEN_COOKIE = "mb_refresh_token";

export const ACCESS_TOKEN_TTL = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
