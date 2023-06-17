import { DocsDisplayModeService } from "@src/services/docs/displayMode/DocsDisplayModeService";
import { Service } from "@src/services/Service";
import { useEffect } from "react";

export const useDisplayMode = (onChange: (dark: boolean) => void) => {
  useEffect(() => {
    Service.getInstance(DocsDisplayModeService).onChange(onChange);

    return () => {
      Service.getInstance(DocsDisplayModeService).offChange(onChange);
    };
  }, []);
};
