export const escape = (str: string) =>
  str
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f]|\x7f/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
