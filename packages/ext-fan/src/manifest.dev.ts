import { ManifestType } from "./manifest-type";

const manifestDev = (manifest: ManifestType): ManifestType => {
  manifest.declarative_net_request = {
    rule_resources: [
      {
        id: "rules_dev",
        enabled: true,
        path: "rules_dev.json",
      },
    ],
  };

  manifest.permissions = [
    ...(manifest.permissions || []),
    "declarativeNetRequest",
  ];

  manifest.host_permissions = [
    ...(manifest.host_permissions || []),
    "*://docs.corp.kuaishou.com/*",
  ];

  return manifest;
};

export default manifestDev;
