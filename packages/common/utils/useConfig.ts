import { ConfigService } from "@src/services/config/ConfigService";
import { Service } from "@src/services/Service";
import { useCallback, useEffect, useState } from "react";

export const useConfig = <T>(configKey: string, defaultValue: T) => {
  const [configValue, setConfigValue] = useState(defaultValue);

  useEffect(() => {
    return Service.getInstance(ConfigService).useConfig(
      configKey,
      defaultValue,
      (value) => {
        setConfigValue(value);
      },
    );
  }, []);

  const changeConfigValue = useCallback(
    (value: typeof defaultValue) => {
      setConfigValue((cur) => {
        if (cur !== value) {
          Service.getInstance(ConfigService)
            .set(configKey, value)
            .then(() => {
              setConfigValue(value);
            });
        }
        return cur;
      });
    },
    [configValue],
  );

  return [configValue, changeConfigValue] as const;
};
