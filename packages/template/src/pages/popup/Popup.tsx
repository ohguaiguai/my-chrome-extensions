import React, { useEffect, useState } from "react";
import { Button, message, Tooltip, Space } from "antd";

import { StorageService } from "common/services/storage/StorageService";
import { TabService } from "common/services/tab/TabService";
import { CookieService } from "common/services/cookie/CookieService";
import { Service } from "common/services/Service";

import { CookiesTable } from "./CookiesTable";

export const Popup = () => {
  const [cookies, setCookies] = useState<chrome.cookies.Cookie[]>([]);

  useEffect(() => {
    (async () => {
      const cookiesArr = await Service.getInstance(StorageService).get(
        "prevCookies",
        [],
      );
      setCookies(cookiesArr);
    })();
  }, []);

  // 获取已登录站点 cookies
  const getCookiesAndStore = async () => {
    // 删除已经获取到的 cookies
    await Service.getInstance(CookieService).removeAllCookies();
    setCookies([]);

    const { url } = await Service.getInstance(TabService).getCurrentTabAndUrl();
    const cookiesArr = await Service.getInstance(CookieService).getCookies(url);
    setCookies(cookiesArr);
    // 保存获取到的 cookies
    await Service.getInstance(StorageService).set("prevCookies", cookiesArr);
    await Service.getInstance(StorageService).set("prevUrl", url + "");

    message.success("获取成功, 打开未登录站点同步!");
    // window.close();
  };

  const syncCookie = async (
    cookie: chrome.cookies.Cookie,
    prevUrl: string,
    curUrl: string,
  ) => {
    return chrome.cookies.remove(
      {
        url: prevUrl,
        name: cookie.name,
      },
      () => {
        chrome.cookies.set({
          url: prevUrl,
          name: cookie.name,
          value: cookie.value,
          path: cookie.path,
          secure: cookie.secure,
          sameSite: cookie.sameSite,
          expirationDate: 24 * 30 * 60 * 60 * 1000 + Date.now(),
        });

        // 保证先设置当前路径下的 cookie, 再设置原来路径下的 cookie
        setTimeout(() => {
          chrome.cookies.set({
            url: curUrl,
            name: cookie.name,
            value: cookie.value,
            path: cookie.path,
            secure: cookie.secure,
            sameSite: cookie.sameSite,
            expirationDate: 24 * 30 * 60 * 60 * 1000 + Date.now(),
          });
        }, 0);
      },
    );
  };

  // 同步 cookie 到当前站点
  const syncCookies = async () => {
    const { url: curUrl } = await Service.getInstance(
      TabService,
    ).getCurrentTabAndUrl();

    const prevUrl = await Service.getInstance(StorageService).get(
      "prevUrl",
      "",
    );

    if (prevUrl && prevUrl === curUrl) {
      message.warning("还未切换站点，打开未登录站点!");
      window.close();
      return;
    }

    const prevCookies = await Service.getInstance(StorageService).get(
      "prevCookies",
      [],
    );

    const pending = prevCookies.map((cookie) => {
      return syncCookie(cookie, prevUrl, curUrl);
    });
    await Promise.all(pending);
    message.success("同步成功, 刷新页面!");
    window.close();
  };

  return (
    <>
      <Space direction='vertical'>
        <Space>
          <Tooltip title='获取当前站点 cookie'>
            <Button
              disabled={cookies.length !== 0}
              onClick={getCookiesAndStore}
            >
              获取
            </Button>
          </Tooltip>
          <Tooltip title='同步已获取到的 cookie 到当前站点'>
            <Button disabled={cookies.length === 0} onClick={syncCookies}>
              同步
            </Button>
          </Tooltip>
        </Space>
        <CookiesTable cookies={cookies} />
      </Space>
    </>
  );
};
