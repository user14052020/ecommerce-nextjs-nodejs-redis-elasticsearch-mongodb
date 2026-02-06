import cookie from "js-cookie";
import type { IncomingMessage } from "http";

const isBrowser = () => typeof window !== "undefined";

export const setCookie = (key: string, value: string): void => {
  if (isBrowser()) {
    cookie.set(key, value, {
      expires: 1,
      path: "/",
    });
  }
};

export const removeCookie = (key: string): void => {
  if (isBrowser()) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (
  key: string,
  req?: IncomingMessage
): string | undefined => {
  return isBrowser() ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key: string): string | undefined => {
  return cookie.get(key);
};

const getCookieFromServer = (
  key: string,
  req?: IncomingMessage
): string | undefined => {
  if (!req?.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split("=")[1];
};
