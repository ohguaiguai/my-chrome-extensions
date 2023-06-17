import { Service } from "../Service";

export class CookieService extends Service {
  async removeAllCookies() {
    return chrome.storage.local.clear(() => {});
  }
  async getCookies(url: string): Promise<chrome.cookies.Cookie[]> {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll(
        {
          url,
        },
        (cookies) => {
          resolve(cookies);
        },
      );
    });
  }

  async setCookie(url: string, cookie: chrome.cookies.Cookie) {
    return new Promise((resolve, reject) => {
      chrome.cookies.set(
        {
          url,
          ...cookie,
        },
        (cookie) => {
          resolve(cookie);
        },
      );
    });
  }

  async removeCookie(url: string, name: string) {
    return new Promise((resolve, reject) => {
      chrome.cookies.remove(
        {
          url,
          name,
        },
        (details) => {
          resolve(details);
        },
      );
    });
  }
}
