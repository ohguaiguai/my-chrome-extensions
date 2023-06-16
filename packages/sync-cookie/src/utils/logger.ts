enum Level {
  DEBUG = 0,
  VERBOSE = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

const level = import.meta.env.VITE_X_LOG_DEBUG
  ? Level.DEBUG - 1
  : Level.INFO - 1;

type ILogger = (label: string) => (...data: any[]) => void;
const empty: ILogger = (_: string) => (..._: any[]) => {};
type IProp = "debug" | "log" | "info" | "warn" | "error";

const Logger = (lv: Level, prop: IProp): ILogger => {
  if (lv <= level) {
    return empty;
  }

  const logger = (label: string) => console[prop].bind(console, `[${label}]`);

  return logger;
};

export const Debug = Logger(Level.DEBUG, "debug");
export const Verbose = Logger(Level.VERBOSE, "log");
export const Info = Logger(Level.INFO, "info");
export const Warn = Logger(Level.WARN, "warn");
export const Error = Logger(Level.ERROR, "error");
