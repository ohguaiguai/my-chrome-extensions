import manifest from "../../src/manifest";
import { PluginOption } from "vite";

export default function makeManifest(): PluginOption {
  return {
    name: "make-manifest",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}
