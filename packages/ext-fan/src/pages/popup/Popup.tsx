import React, { ChangeEvent, MouseEvent, ReactNode, useCallback } from "react";
import "@src/utils/common.css";

import { ReactComponent as Logo } from "@assets/img/logo.svg";

import { ReactComponent as IconLike } from "@assets/img/icon-like.svg";

import {
  CONFIG_DISPLAY_MODE,
  CONFIG_DISPLAY_MODE_AUTO,
  CONFIG_DISPLAY_MODE_DARK,
  CONFIG_DISPLAY_MODE_LIGHT,
  CONFIG_TAB_GROUP,
  CONFIG_TAB_NAV,
  LINK_DOC,
  LINK_LIKE,
} from "@src/constants";
import { useConfig } from "@src/utils/useConfig";
import { useDisplayMode } from "@src/utils/useDisplayMode";
import clsx from "clsx";
import { i18n } from "@src/utils/i18n";
import { Tooltip, TooltipContainer } from "@src/components/tooltip/Tooltip";

type IConfig<T> = {
  label: React.ReactNode;
  key: string;
  defaultValue: T;
  options?: {
    label: React.ReactNode;
    value: T;
  }[];
  help?: string;
};

type Config = IConfig<string | boolean>;

const configs: Config[] = [
  {
    label: (
      <>
        <span>{i18n("displayMode")}</span>
        <span className="ml-2 text-xs badge badge-accent text-accent-content">
          {i18n("experimental")}
        </span>
      </>
    ),
    key: CONFIG_DISPLAY_MODE,
    options: [
      {
        label: i18n("displayModeLight"),
        value: CONFIG_DISPLAY_MODE_LIGHT,
      },
      {
        label: i18n("displayModeDark"),
        value: CONFIG_DISPLAY_MODE_DARK,
      },
      {
        label: i18n("displayModeAuto"),
        value: CONFIG_DISPLAY_MODE_AUTO,
      },
    ],
    defaultValue: CONFIG_DISPLAY_MODE_LIGHT,
  },
  {
    label: i18n("tabAutoGroup"),
    key: CONFIG_TAB_GROUP,
    help: i18n("tabAutoGroupTooltip"),
    defaultValue: false,
  },
  {
    label: i18n("tabNav"),
    key: CONFIG_TAB_NAV,
    help: i18n("tabNavTooltip"),
    defaultValue: false,
  },
];

const ConfigRow = ({
  config: { label, key, defaultValue, options, help },
}: {
  config: Config;
}) => {
  const [configValue, setConfigValue] = useConfig(key, defaultValue);
  const onCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;

    setConfigValue(value);
  }, []);
  const onButtonClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const value = (e.target as HTMLButtonElement).value;

    setConfigValue(value);
  }, []);

  let control: ReactNode = null;

  if (typeof defaultValue === "boolean") {
    const cv = configValue as boolean;

    control = (
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={cv}
        onChange={onCheckboxChange}
      />
    );
  } else {
    const cv = configValue!;
    const opts = options!;
    control = (
      <div className="btn-group">
        {opts.map((op) => (
          <button
            className={clsx("btn btn-sm", op.value === cv && "btn-active")}
            key={op.value as string}
            value={op.value as string}
            onClick={onButtonClick}
          >
            {op.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 px-6 py-3 grid grid-cols-2 gap-4 items-center">
      <dt className="text-base text-base-content col-span-2">
        {label}
        {help && (
          <Tooltip
            className="text-accent w-4 h-4 inline-block"
            tip={help}
          ></Tooltip>
        )}
      </dt>
      <dd className="col-span-2">{control}</dd>
    </div>
  );
};

const useDisplayTheme = () => {
  const onDisplayModeChange = useCallback((isDark: boolean) => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  useDisplayMode(onDisplayModeChange);
};

export const Popup: () => JSX.Element = () => {
  useDisplayTheme();

  return (
    <div className="bg-base-100">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a
            href={LINK_DOC}
            target="_blank"
            title={i18n("howTo")}
            className="btn btn-ghost px-0"
          >
            <Logo className="w-40 h-12" />
          </a>
        </div>
        <div className="flex-none">
          <a
            href={LINK_LIKE}
            target="_blank"
            title={i18n("likeMe")}
            className="btn gap-2 btn-ghost hover:text-warning"
          >
            {i18n("likeMe")}
            <IconLike className="inline-block w-5 h-5" />
          </a>
        </div>
      </div>
      <dl>
        {configs.map((config) => (
          <ConfigRow key={config.key} config={config}></ConfigRow>
        ))}
        <TooltipContainer />
      </dl>
    </div>
  );
};
